import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { MissionRequest } from './mission-request.model';
import { User } from './user.model';

export type FundStatus = 'pending' | 'disbursed';

export interface FundAllocationAttributes {
  id: string;
  missionId: string;
  allocatedAmount: number;
  allocatedBy: string;
  status: FundStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type FundAllocationCreationAttributes = Optional<FundAllocationAttributes, 'id' | 'status'>;

export class FundAllocation
  extends Model<FundAllocationAttributes, FundAllocationCreationAttributes>
  implements FundAllocationAttributes
{
  public id!: string;
  public missionId!: string;
  public allocatedAmount!: number;
  public allocatedBy!: string;
  public status!: FundStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initFundAllocationModel = (sequelize: Sequelize): typeof FundAllocation => {
  FundAllocation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      missionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: MissionRequest,
          key: 'id'
        }
      },
      allocatedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      allocatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('pending', 'disbursed'),
        allowNull: false,
        defaultValue: 'pending'
      }
    },
    {
      sequelize,
      tableName: 'fund_allocations',
      modelName: 'FundAllocation'
    }
  );

  return FundAllocation;
};



