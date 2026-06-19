import { Response } from 'express';
import { ApiResponse } from '../types';

export function successResponse<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400
) {
  const response: ApiResponse = {
    success: false,
    message,
  };
  return res.status(statusCode).json(response);
}
