import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { fail } from '../utils/response';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization');
  if (!auth) return fail(res, 401, 'Missing Authorization header');
  const token = auth.replace('Bearer ', '') || auth;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.id, name: payload.name, role: payload.role };
    next();
  } catch (err) {
    return fail(res, 401, 'Invalid or expired token');
  }
};

export const requireRole = (roles: Array<'contributor' | 'maintainer'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return fail(res, 401, 'Not authenticated');
    if (!roles.includes(req.user.role)) return fail(res, 403, 'Forbidden');
    next();
  };
};
