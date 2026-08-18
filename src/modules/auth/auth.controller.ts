import { Request, Response } from 'express';
import { createUser, findUserByEmail } from './auth.service';
import { fail, success } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return fail(res, 400, 'Missing fields');
  const useRole = role === 'maintainer' ? 'maintainer' : 'contributor';
  try {
    const existing = await findUserByEmail(email);
    if (existing) return fail(res, 409, 'Email already registered');
    const user = await createUser(name, email, password, useRole as any);
    return success(res, StatusCodes.CREATED, 'User registered successfully', user);
  } catch (err: any) {
    return fail(res, 500, 'Failed to register user', err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 400, 'Missing fields');
  try {
    const user = await findUserByEmail(email);
    if (!user) return fail(res, 401, 'Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return fail(res, 401, 'Invalid credentials');
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return success(res, StatusCodes.OK, 'Login successful', { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at, updated_at: user.updated_at } });
  } catch (err: any) {
    return fail(res, 500, 'Login failed', err.message);
  }
};
