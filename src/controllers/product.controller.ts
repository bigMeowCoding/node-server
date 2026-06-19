import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { successResponse, errorResponse } from '../utils/response';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;
      const products = await ProductService.getAllProducts({ page, pageSize });
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
