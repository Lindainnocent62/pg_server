import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../utils/db'; // Assuming sequelize instance is set up here
import { Address } from './cartModels';
import bcrypt from 'bcrypt'

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public firstName?: string;
  public lastName?: string;
  public phone?: string;
  public addressStreet_1?: string;
  public addressStreet_2?: string;
  public addressCity?: string;
  public addressProvince?: string;
  public addressCountry?: string;
  public addressPostalCode?: string;
  public isProfileComplete!: boolean;
  public isOnboardingComplete?: boolean; 
  public resetToken?: string;
  public resetTokenExpiration?: Date;

  // Hash password before saving
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password,10);
  }

  // Verify password during authentication
  public async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(this.password, password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressStreet_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressStreet_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressProvince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressCountry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressPostalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  // Setting default to false
    },
    isOnboardingComplete: { 
      type: DataTypes.BOOLEAN,  
      defaultValue: false, // Setting default to false
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') as unknown as string, 
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP') as unknown as string, 
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          await user.hashPassword();
        }
      },
    },
  }
);
User.hasOne(Address, { foreignKey: 'userId' }); // Assuming one address per user
Address.belongsTo(User, { foreignKey: 'userId' });

export default User;
