import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { MissionRequest } from './mission-request.model';
import { User } from './user.model';

export type MissionExpenseStatus = 'pending_finance' | 'approved' | 'rejected';

export interface MissionExpenseAttributes {
  id: string;
  missionId: string;
  submittedBy: string;
  expenseType: string;
  amount: number;
  receiptFile?: string | null;
  status: MissionExpenseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type MissionExpenseCreationAttributes = Optional<MissionExpenseAttributes, 'id' | 'receiptFile' | 'status'>;

export class MissionExpense
  extends Model<MissionExpenseAttributes, MissionExpenseCreationAttributes>
  implements MissionExpenseAttributes
{
  public id!: string;
  public missionId!: string;
  public submittedBy!: string;
  public expenseType!: string;
  public amount!: number;
  public receiptFile?: string | null;
  public status!: MissionExpenseStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initMissionExpenseModel = (sequelize: Sequelize): typeof MissionExpense => {
  MissionExpense.init(
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
      submittedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
      },
      expenseType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      receiptFile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending_finance', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending_finance'
      }
    },
    {
      sequelize,
      tableName: 'mission_expenses',
      modelName: 'MissionExpense'
    }
  );

  return MissionExpense;
};



