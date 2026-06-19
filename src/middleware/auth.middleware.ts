import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response';

interface JwtPayload {
  userId: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, '请先登录', 401);
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
      return errorResponse(res, '请先登录', 401);
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-here-change-it-in-production';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, '无效的认证令牌', 401);
  }
};
