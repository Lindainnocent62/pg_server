import { Model, DataTypes,Optional } from 'sequelize';
import sequelize from '../utils/db';

interface AddressItem {
  id: number;
  userId: number;
  diliveryType: string;
  street_1: string;
  street_2?: string;
  city: string;
  province: string;
  companyName?: string; 
  country: string;
  postalCode: string;
  createdAt?: Date;
}

export class Address extends Model<AddressItem, Optional<AddressItem, 'id'>> implements AddressItem {
  public id!: number;
  public userId!: number;
  public diliveryType!: 'Home' | 'Business' | 'International' | 'Pick-Up';
  public street_1!: string;
  public street_2?: string | '';
  public city!: string;
  public province!: string;
  public country!: string;
  public postalCode!: string;
  public readonly createdAt!: Date;
}

// Initializing the model
Address.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  diliveryType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street_1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street_2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { sequelize, modelName: 'Address', tableName: 'address', timestamps: false });

// Cart Model
export class Cart extends Model {
  public id!: number;
  public userId!: number;
  public items!: string; // JSON string to store array of cart items
  public totalAmount!: number;
  public deliveryFee!: number;
  public itemCount!: number;
  public deliveryNote!: string | null;
  public deliveryAddress!: string; // JSON string to store delivery address
  public createdAt!: Date;
}

Cart.init(
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    items: { type: DataTypes.JSON, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deliveryFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    itemCount: { type: DataTypes.INTEGER, allowNull: false },
    deliveryNote: { type: DataTypes.STRING, allowNull: true },
    deliveryAddress: { type: DataTypes.JSON, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: 'Cart', tableName: 'checkout_table' }
);
