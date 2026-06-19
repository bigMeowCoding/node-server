# 商城系统后端 API 设计文档

## 1. 项目概述

本文档描述了商城系统的后端 API 设计，基于前端 react-demo 项目的需求开发。

### 1.1 技术栈建议

- **运行环境**: Node.js
- **Web 框架**: Express.js
- **数据库**: MySQL 8.0+ 或 PostgreSQL 13+
- **ORM**: Sequelize (TypeScript)
- **认证**: JWT (JSON Web Token)
- **语言**: TypeScript

### 1.2 项目结构

```
node-server/
├── src/
│   ├── config/         # 配置文件
│   │   └── database.ts
│   ├── controllers/    # 控制器
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   └── cart.controller.ts
│   ├── middleware/     # 中间件
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/         # 数据模型
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Cart.ts
│   ├── routes/         # 路由
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── cart.routes.ts
│   ├── services/       # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   └── cart.service.ts
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   │   └── response.ts
│   └── index.ts        # 入口文件
├── .env
├── package.json
└── api-spec.yaml
```

---

## 2. 数据库设计

### 2.1 用户表 (users)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  login_time DATETIME COMMENT '最后登录时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认用户（密码需要加密）
INSERT INTO users (username, password) VALUES 
('root', '$2b$10$...'); -- 123 的 bcrypt 哈希
```

### 2.2 商品表 (products)

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  price DECIMAL(10, 2) NOT NULL COMMENT '价格',
  description TEXT COMMENT '商品描述',
  image VARCHAR(500) COMMENT '商品图片URL',
  category VARCHAR(100) COMMENT '分类',
  stock INT DEFAULT 0 COMMENT '库存',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 插入示例商品数据
INSERT INTO products (name, price, description, image, category, stock) VALUES 
('无线蓝牙耳机 Pro', 299.00, '高品质无线蓝牙耳机，主动降噪，续航40小时', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', '电子产品', 50),
('智能手表', 899.00, '全面屏智能手表，支持心率监测、运动追踪', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', '电子产品', 30),
('时尚双肩包', 199.00, '大容量休闲双肩包，防水耐磨，多种颜色可选', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', '箱包', 100),
('便携充电宝', 129.00, '20000mAh大容量充电宝，支持快充', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', '电子产品', 80),
('机械键盘 RGB', 499.00, 'RGB背光机械键盘，青轴手感，游戏办公两用', 'https://images.unsplash.com/photo-1511467687857-3bdc506f8e0e?w=400&h=400&fit=crop', '电子产品', 40),
('运动水杯', 69.00, '大容量运动水杯，耐高温，食品级材质', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', '生活用品', 200);
```

### 2.3 购物车表 (cart)

```sql
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  quantity INT DEFAULT 1 COMMENT '数量',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_product (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';
```

---

## 3. TypeScript 类型定义

```typescript
// src/types/index.ts

// 用户
export interface User {
  id: number;
  username: string;
  loginTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 用户（不包含敏感信息）
export interface SafeUser {
  id: number;
  username: string;
  loginTime?: Date;
}

// 商品
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

// 购物车项
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

// 购物车（包含商品详情）
export interface CartWithProduct {
  items: (CartItem & { product: Product })[];
  total: number;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 添加购物车请求
export interface AddToCartRequest {
  productId: number;
  quantity?: number;
}

// 更新购物车请求
export interface UpdateCartRequest {
  quantity: number;
}

// API 响应
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
```

---

## 4. API 详细说明

### 4.1 用户认证模块

#### POST /api/auth/login
- **描述**: 用户登录
- **请求体**:
  ```json
  {
    "username": "root",
    "password": "123"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "username": "root",
        "loginTime": "2024-06-19T10:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "登录成功"
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "message": "用户名或密码不正确"
  }
  ```

#### POST /api/auth/logout
- **描述**: 用户登出
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

#### GET /api/auth/me
- **描述**: 获取当前用户信息
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "username": "root",
      "loginTime": "2024-06-19T10:30:00.000Z"
    }
  }
  ```

### 4.2 商品模块

#### GET /api/products
- **描述**: 获取商品列表
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "无线蓝牙耳机 Pro",
        "price": 299,
        "description": "高品质无线蓝牙耳机，主动降噪，续航40小时",
        "image": "https://...",
        "category": "电子产品",
        "stock": 50
      }
    ]
  }
  ```

#### GET /api/products/:id
- **描述**: 获取商品详情
- **路径参数**: `id` - 商品ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "无线蓝牙耳机 Pro",
      "price": 299,
      "description": "高品质无线蓝牙耳机，主动降噪，续航40小时",
      "image": "https://...",
      "category": "电子产品",
      "stock": 50
    }
  }
  ```

### 4.3 购物车模块

#### GET /api/cart
- **描述**: 获取购物车
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "name": "无线蓝牙耳机 Pro",
          "price": 299,
          "description": "高品质无线蓝牙耳机，主动降噪，续航40小时",
          "image": "https://...",
          "category": "电子产品",
          "stock": 50,
          "quantity": 2
        }
      ],
      "total": 598
    }
  }
  ```

#### POST /api/cart
- **描述**: 添加商品到购物车
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "productId": 1,
    "quantity": 1
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "无线蓝牙耳机 Pro",
      "price": 299,
      "description": "高品质无线蓝牙耳机，主动降噪，续航40小时",
      "image": "https://...",
      "category": "电子产品",
      "stock": 50,
      "quantity": 1
    },
    "message": "添加成功"
  }
  ```

#### PUT /api/cart/:productId
- **描述**: 更新购物车商品数量
- **请求头**: `Authorization: Bearer <token>`
- **路径参数**: `productId` - 商品ID
- **请求体**:
  ```json
  {
    "quantity": 2
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "无线蓝牙耳机 Pro",
      "price": 299,
      "description": "高品质无线蓝牙耳机，主动降噪，续航40小时",
      "image": "https://...",
      "category": "电子产品",
      "stock": 50,
      "quantity": 2
    },
    "message": "更新成功"
  }
  ```

#### DELETE /api/cart/:productId
- **描述**: 从购物车删除商品
- **请求头**: `Authorization: Bearer <token>`
- **路径参数**: `productId` - 商品ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

#### POST /api/cart/clear
- **描述**: 清空购物车
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "message": "购物车已清空"
  }
  ```

---

## 5. 环境变量配置 (.env)

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# JWT 配置
JWT_SECRET=your-secret-key-here-change-it-in-production
JWT_EXPIRES_IN=7d

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=shop_db
DB_DIALECT=mysql

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 6. 依赖包建议

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "sequelize": "^6.33.0",
    "mysql2": "^3.6.1",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/node": "^20.8.4",
    "@types/express": "^4.17.19",
    "@types/cors": "^2.8.14",
    "@types/jsonwebtoken": "^9.0.3",
    "@types/bcryptjs": "^2.4.4",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0"
  }
}
```

---

## 7. 开发建议

1. **初始化数据库**: 先执行 SQL 脚本创建表和初始数据
2. **JWT 认证**: 使用 Bearer Token 方式进行身份认证
3. **密码加密**: 使用 bcryptjs 对密码进行加密存储
4. **错误处理**: 统一的错误处理中间件
5. **CORS**: 允许前端域名跨域访问
6. **接口文档**: 可以使用 Swagger UI 来展示 api-spec.yaml
