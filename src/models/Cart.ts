import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Product from './Product';

interface CartAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt' | 'quantity'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly product?: Product;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'cart',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
      },
    ],
  }
);

Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export default Cart;
