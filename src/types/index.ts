export interface User {
  id: number;
  username: string;
  loginTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: number;
  username: string;
  loginTime?: Date;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

export interface CartProductItem extends Product {
  id: number;
  productId: number;
  quantity: number;
}

export interface CartWithProduct {
  items: CartProductItem[];
  total: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity?: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
