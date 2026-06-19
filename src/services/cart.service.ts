import Cart from '../models/Cart';
import Product from '../models/Product';
import { CartWithProduct, CartProductItem } from '../types';

type CartWithProductData = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class CartService {
  static async getCart(userId: number): Promise<CartWithProduct> {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    const items: CartProductItem[] = cartItems.map(item => {
      const cartData = item.toJSON() as CartWithProductData;
      if (!cartData.product) {
        throw new Error('商品信息缺失');
      }
      return {
        ...cartData.product,
        id: cartData.id,
        productId: cartData.productId,
        quantity: cartData.quantity,
      } as CartProductItem;
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, total };
  }

  static async addToCart(userId: number, productId: number, quantity = 1): Promise<CartProductItem> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    let cartItem = await Cart.findOne({ where: { userId, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [{ model: Product, as: 'product' }],
    });

    if (!updatedItem || !updatedItem.product) {
      throw new Error('添加失败');
    }

    const itemData = updatedItem.toJSON() as CartWithProductData;
    if (!itemData.product) {
      throw new Error('添加失败');
    }
    return {
      ...itemData.product,
      id: itemData.id,
      productId: itemData.productId,
      quantity: itemData.quantity,
    } as CartProductItem;
  }

  static async updateCart(userId: number, productId: number, quantity: number): Promise<CartProductItem> {
    if (quantity <= 0) {
      throw new Error('数量必须大于0');
    }

    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) {
      throw new Error('购物车中没有该商品');
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [{ model: Product, as: 'product' }],
    });

    if (!updatedItem || !updatedItem.product) {
      throw new Error('更新失败');
    }

    const itemData = updatedItem.toJSON() as CartWithProductData;
    if (!itemData.product) {
      throw new Error('更新失败');
    }
    return {
      ...itemData.product,
      id: itemData.id,
      productId: itemData.productId,
      quantity: itemData.quantity,
    } as CartProductItem;
  }

  static async removeFromCart(userId: number, productId: number) {
    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) {
      throw new Error('购物车中没有该商品');
    }
    await cartItem.destroy();
  }

  static async clearCart(userId: number) {
    await Cart.destroy({ where: { userId } });
  }
}
