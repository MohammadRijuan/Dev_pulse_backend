import { query } from '../../utils/db';
import bcrypt from 'bcrypt';
import { User } from '../user/user.types';

export const createUser = async (name: string, email: string, password: string, role: 'contributor' | 'maintainer') => {
  const hashed = await bcrypt.hash(password, 10);
  const text = `INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,created_at,updated_at`;
  const { rows } = await query(text, [name, email, hashed, role]);
  return rows[0] as Omit<User, 'password'>;
};

export const findUserByEmail = async (email: string) => {
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
  return rows[0] as (User & { password: string }) | undefined;
};

export const findUserById = async (id: number) => {
  const { rows } = await query('SELECT id,name,email,role,created_at,updated_at FROM users WHERE id=$1', [id]);
  return rows[0] as User | undefined;
};
