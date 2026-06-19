import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize: Sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_DATABASE || 'shop_db',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
}

export default sequelize;
