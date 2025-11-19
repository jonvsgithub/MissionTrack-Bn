import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './user.model';

export type MissionStatus =
  | 'pending_manager'
  | 'pending_hr'
  | 'pending_finance'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface MissionRequestAttributes {
  id: string;
  userId: string;
  organizationId?: string | null;
  purpose: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  estimatedCost: number;
  status: MissionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type MissionRequestCreationAttributes = Optional<MissionRequestAttributes, 'id' | 'status' | 'organizationId'>;

export class MissionRequest
  extends Model<MissionRequestAttributes, MissionRequestCreationAttributes>
  implements MissionRequestAttributes
{
  public id!: string;
  public userId!: string;
  public organizationId?: string | null;
  public purpose!: string;
  public destination!: string;
  public startDate!: Date;
  public endDate!: Date;
  public duration!: number;
  public estimatedCost!: number;
  public status!: MissionStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initMissionRequestModel = (sequelize: Sequelize): typeof MissionRequest => {
  MissionRequest.init(
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
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      estimatedCost: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending_manager', 'pending_hr', 'pending_finance', 'approved', 'rejected', 'completed'),
        allowNull: false,
        defaultValue: 'pending_manager'
      }
    },
    {
      sequelize,
      tableName: 'missions',
      modelName: 'MissionRequest'
    }
  );

  return MissionRequest;
};

