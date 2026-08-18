import { Response } from 'express';

export const success = (res: Response, status: number, message: string, data: any) =>
  res.status(status).json({ success: true, message, data });

export const fail = (res: Response, status: number, message: string, errors?: any) =>
  res.status(status).json({ success: false, message, errors });
