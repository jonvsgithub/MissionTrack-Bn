import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type OrganizationStatus = 'pending' | 'approved' | 'rejected';

export interface OrganizationAttributes {
  id: string;
  name: string;
  province: string;
  district: string;
  sector: string;
  email: string;
  phone: string;
  proofDocument: string | null;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  passwordHash: string;
  status: OrganizationStatus;
  createdByAdminId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrganizationCreationAttributes = Optional<OrganizationAttributes, 'id' | 'proofDocument' | 'status' | 'createdByAdminId'>;

export class Organization extends Model<OrganizationAttributes, OrganizationCreationAttributes> implements OrganizationAttributes {
  public id!: string;
  public name!: string;
  public province!: string;
  public district!: string;
  public sector!: string;
  public email!: string;
  public phone!: string;
  public proofDocument!: string | null;
  public contactPersonName!: string;
  public contactPersonPhone!: string;
  public contactPersonEmail!: string;
  public passwordHash!: string;
  public status!: OrganizationStatus;
  public createdByAdminId?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initOrganizationModel = (sequelize: Sequelize): typeof Organization => {
  Organization.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sector: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      proofDocument: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contactPersonPhone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contactPersonEmail: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdByAdminId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'organizations',
      modelName: 'Organization'
    }
  );

  return Organization;
};



