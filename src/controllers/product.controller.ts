import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { successResponse, errorResponse } from '../utils/response';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      return successResponse(res, products);
    } catch (error) {
      return errorResponse(res, (error as Error).message);
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return errorResponse(res, '无效的商品ID');
      }
      const product = await ProductService.getProductById(id);
      return successResponse(res, product);
    } catch (error) {
      return errorResponse(res, (error as Error).message, 404);
    }
  }
}
