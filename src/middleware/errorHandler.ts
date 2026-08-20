import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const detail = Array.isArray(err.errors) && err.errors.length
    ? err.errors.map((e: any) => e.message || String(e)).join('; ')
    : err.message || 'Unknown error';

  console.error('[errorHandler]', detail, err.stack || err);

  return fail(res, err.status || 500, err.message || 'Internal Server Error', detail);
};