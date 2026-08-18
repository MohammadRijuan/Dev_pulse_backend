import type { Iuser } from './user.interface';
import { pool } from '../../db';
import bcrypt from 'bcryptjs';

const createUserIntoDb = async (payload: Iuser) => {
  const { name, email, password, age, role = 'user' } = payload as Iuser;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *`,
    [name, email, hashPassword, role],
  );
  if (result.rows[0]) delete (result.rows[0] as any).password;

  return result;
};

const getAllUserFromDb = async () => {
  const result = await pool.query(`SELECT id,name,email,role,created_at,updated_at FROM users`);
  return result;
};

const getSingleUserFromDb = async (id: string) => {
  const result = await pool.query(`SELECT id,name,email,role,created_at,updated_at FROM users WHERE id=$1`, [id]);
  if (result.rows[0]) delete (result.rows[0] as any).password;
  return result;
};

const updateUserFromDb = async (payload: Partial<Iuser>, id: string) => {
  const { name, password, age, is_Active } = payload as Partial<Iuser>;

  const hashed = password ? await bcrypt.hash(password, 10) : undefined;

  const result = await pool.query(
    `UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password), age = COALESCE($3, age), is_active = COALESCE($4, is_active), updated_at=now() WHERE id = $5 RETURNING id,name,email,role,created_at,updated_at;`,
    [name, hashed || null, age || null, typeof is_Active === 'boolean' ? is_Active : null, id],
  );
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id,name,email,role,created_at,updated_at;`, [id]);
  return result;
};

export const userService = {
  createUserIntoDb,
  getAllUserFromDb,
  getSingleUserFromDb,
  updateUserFromDb,
  deleteUserFromDb,
};
