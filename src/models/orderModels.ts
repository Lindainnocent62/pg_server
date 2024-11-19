import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/db';

//I found this as another way to define your model without enforcing datatypes using Typescript
export class Checkout extends Model {
  public id!: number;
  public userId!: number;
  public deliveryType!: 'postnet_to_door' | 'postnet_to_postnet' | 'postnet_to_international' | 'collection';
  public street1?: string;
  public street2?: string;
  public city?: string;
  public province?: string;
  public country?: string;
  public postalCode?: string;
  public deliveryNote?: string;
  public postnetAddress?: string;
  public cardholderName!: string;
  public cardNumber!: string;
  public cvv!: string;
  public expiryDate!: string;
  public createdAt!: Date
}

Checkout.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    deliveryType: {
      type: DataTypes.ENUM('postnet_to_door', 'postnet_to_postnet', 'postnet_to_international', 'collection'),
      allowNull: false,
    },
    street1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postnetAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardholderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'checkouts',
    modelName: 'Checkout',
  }
);

export default Checkout;
