import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { LoginRequest } from '../types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body as LoginRequest;
      if (!username || !password) {
        return errorResponse(res, '用户名和密码不能为空');
      }

      const result = await AuthService.login({ username, password });
      return successResponse(res, result, '登录成功');
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }

  static async logout(req: Request, res: Response) {
    return successResponse(res, undefined, '登出成功');
  }

  static async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      const user = await AuthService.getCurrentUser(req.user.userId);
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }
}
