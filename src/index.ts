import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import sequelize from './config/database';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import { ProductService } from './services/product.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorMiddleware);

async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_DATABASE || 'shop_db';

  const tempSequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: false,
  });

  try {
    await tempSequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log('数据库已创建或已存在');
  } catch (error) {
    console.log('尝试创建数据库失败（可能已经存在）:', (error as Error).message);
  } finally {
    await tempSequelize.close();
  }
}

async function startServer() {
  try {
    await createDatabaseIfNotExists();

    await sequelize.sync({ force: false });
    console.log('数据库连接成功');

    await ProductService.initSampleProducts();
    console.log('示例数据初始化完成');

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();
