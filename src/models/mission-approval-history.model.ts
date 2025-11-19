import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { MissionRequest } from './mission-request.model';
import { User } from './user.model';

export interface MissionApprovalHistoryAttributes {
  id: string;
  missionId: string;
  approverId: string;
  role: string;
  action: 'approved' | 'rejected';
  comment?: string | null;
  createdAt?: Date;
}

type MissionApprovalHistoryCreationAttributes = Optional<MissionApprovalHistoryAttributes, 'id' | 'comment'>;

export class MissionApprovalHistory
  extends Model<MissionApprovalHistoryAttributes, MissionApprovalHistoryCreationAttributes>
  implements MissionApprovalHistoryAttributes
{
  public id!: string;
  public missionId!: string;
  public approverId!: string;
  public role!: string;
  public action!: 'approved' | 'rejected';
  public comment?: string | null;
  public readonly createdAt!: Date;
}

export const initMissionApprovalHistoryModel = (sequelize: Sequelize): typeof MissionApprovalHistory => {
  MissionApprovalHistory.init(
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
      approverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      action: {
        type: DataTypes.ENUM('approved', 'rejected'),
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'mission_approval_histories',
      modelName: 'MissionApprovalHistory',
      updatedAt: false
    }
  );

  return MissionApprovalHistory;
};



