import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './user.model';

export interface AuditLogAttributes {
  id: string;
  userId: string;
  action: string;
  module: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  createdAt?: Date;
}

type AuditLogCreationAttributes = Optional<AuditLogAttributes, 'id' | 'oldValue' | 'newValue'>;

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public userId!: string;
  public action!: string;
  public module!: string;
  public oldValue?: Record<string, unknown> | null;
  public newValue?: Record<string, unknown> | null;
  public readonly createdAt!: Date;
}

export const initAuditLogModel = (sequelize: Sequelize): typeof AuditLog => {
  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false
      },
      oldValue: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      newValue: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'audit_logs',
      modelName: 'AuditLog',
      updatedAt: false
    }
  );

  return AuditLog;
};



