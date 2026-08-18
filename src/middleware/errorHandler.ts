import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return fail(res, err.status || 500, err.message || 'Internal Server Error', err);
};
