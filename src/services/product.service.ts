import Product from '../models/Product';
import { PaginationParams, PaginatedResult } from '../types';

export class ProductService {
  static async getAllProducts(params?: PaginationParams): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 10);
    const offset = (page - 1) * pageSize;

    const { count, rows: items } = await Product.findAndCountAll({
      limit: pageSize,
      offset,
    });

    return {
      items,
      total: count,
      page,
      pageSize,
    };
  }

  static async getProductById(id: number) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('商品不存在');
    }
    return product;
  }

  static async initSampleProducts() {
    const count = await Product.count();
    if (count === 0) {
      const sampleProducts = [
        {
          name: '无线蓝牙耳机 Pro',
          price: 299.00,
          description: '高品质无线蓝牙耳机，主动降噪，续航40小时',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          category: '电子产品',
          stock: 50,
        },
        {
          name: '智能手表',
          price: 899.00,
          description: '全面屏智能手表，支持心率监测、运动追踪',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          category: '电子产品',
          stock: 30,
        },
        {
          name: '时尚双肩包',
          price: 199.00,
          description: '大容量休闲双肩包，防水耐磨，多种颜色可选',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          category: '箱包',
          stock: 100,
        },
        {
          name: '便携充电宝',
          price: 129.00,
          description: '20000mAh大容量充电宝，支持快充',
          image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
          category: '电子产品',
          stock: 80,
        },
        {
          name: '机械键盘 RGB',
          price: 499.00,
          description: 'RGB背光机械键盘，青轴手感，游戏办公两用',
          image: 'https://images.unsplash.com/photo-1511467687857-3bdc506f8e0e?w=400&h=400&fit=crop',
          category: '电子产品',
          stock: 40,
        },
        {
          name: '运动水杯',
          price: 69.00,
          description: '大容量运动水杯，耐高温，食品级材质',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
          category: '生活用品',
          stock: 200,
        },
      ];
      await Product.bulkCreate(sampleProducts);
    }
  }
}
