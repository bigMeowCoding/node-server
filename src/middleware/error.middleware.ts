import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  return errorResponse(res, err.message || '服务器内部错误', 500);
};
