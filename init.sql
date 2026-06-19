CREATE DATABASE IF NOT EXISTS shop_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  login_time DATETIME COMMENT '最后登录时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS cart (
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

INSERT INTO products (name, price, description, image, category, stock) VALUES 
('无线蓝牙耳机 Pro', 299.00, '高品质无线蓝牙耳机，主动降噪，续航40小时', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', '电子产品', 50),
('智能手表', 899.00, '全面屏智能手表，支持心率监测、运动追踪', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', '电子产品', 30),
('时尚双肩包', 199.00, '大容量休闲双肩包，防水耐磨，多种颜色可选', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', '箱包', 100),
('便携充电宝', 129.00, '20000mAh大容量充电宝，支持快充', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', '电子产品', 80),
('机械键盘 RGB', 499.00, 'RGB背光机械键盘，青轴手感，游戏办公两用', 'https://images.unsplash.com/photo-1511467687857-3bdc506f8e0e?w=400&h=400&fit=crop', '电子产品', 40),
('运动水杯', 69.00, '大容量运动水杯，耐高温，食品级材质', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', '生活用品', 200)
ON DUPLICATE KEY UPDATE name=name;
