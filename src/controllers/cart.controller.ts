import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { successResponse, errorResponse } from '../utils/response';
import { AddToCartRequest, UpdateCartRequest } from '../types';

export class CartController {
  static async getCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      const cart = await CartService.getCart(req.user.userId);
      return successResponse(res, cart);
    } catch (error) {
      return errorResponse(res, (error as Error).message);
    }
  }

  static async addToCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      const { productId, quantity } = req.body as AddToCartRequest;
      if (!productId) {
        return errorResponse(res, '商品ID不能为空');
      }
      const result = await CartService.addToCart(req.user.userId, productId, quantity);
      return successResponse(res, result, '添加成功');
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }

  static async updateCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body as UpdateCartRequest;
      if (isNaN(productId)) {
        return errorResponse(res, '无效的商品ID');
      }
      if (!quantity || quantity <= 0) {
        return errorResponse(res, '数量必须大于0');
      }
      const result = await CartService.updateCart(req.user.userId, productId, quantity);
      return successResponse(res, result, '更新成功');
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }

  static async removeFromCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return errorResponse(res, '无效的商品ID');
      }
      await CartService.removeFromCart(req.user.userId, productId);
      return successResponse(res, undefined, '删除成功');
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }

  static async clearCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, '请先登录', 401);
      }
      await CartService.clearCart(req.user.userId);
      return successResponse(res, undefined, '购物车已清空');
    } catch (error) {
      return errorResponse(res, (error as Error).message, 400);
    }
  }
}
