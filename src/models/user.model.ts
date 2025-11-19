import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Organization } from './organization.model';

export type UserRole = 'employee' | 'manager' | 'hr' | 'finance' | 'admin';

export interface UserAttributes {
  id: string;
  organizationId?: string | null;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  department?: string | null;
  role: UserRole;
  status: 'active' | 'disabled';
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'organizationId' | 'phone' | 'department' | 'status'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public organizationId?: string | null;
  public fullName!: string;
  public email!: string;
  public passwordHash!: string;
  public phone?: string | null;
  public department?: string | null;
  public role!: UserRole;
  public status!: 'active' | 'disabled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: Organization,
          key: 'id'
        }
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('employee', 'manager', 'hr', 'finance', 'admin'),
        allowNull: false,
        defaultValue: 'employee'
      },
      status: {
        type: DataTypes.ENUM('active', 'disabled'),
        allowNull: false,
        defaultValue: 'active'
      }
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User'
    }
  );

  return User;
};



