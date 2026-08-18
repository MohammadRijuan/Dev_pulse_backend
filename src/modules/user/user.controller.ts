import type { Request, Response } from 'express';
import { pool } from '../../db';
import { userService } from './user.service';

// create a user

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);

    res.status(201).json({
      message: 'user created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

// get all users
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT id,name,email,role,created_at,updated_at FROM users`);
    res.status(200).json({
      success: true,
      message: 'users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// get singleuser
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFromDb(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'user not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'single user retrieved successfully', data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: error });
  }
};

// update a user
const updateSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserFromDb(req.body, id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete user
const deleteSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDb(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully', data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};

export { createUser, getAllUser, getSingleUser, updateSingleUser, deleteSingleUser };
