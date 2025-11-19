import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { initOrganizationModel, Organization } from './organization.model';
import { initUserModel, User } from './user.model';
import { initMissionRequestModel, MissionRequest } from './mission-request.model';
import { initMissionExpenseModel, MissionExpense } from './mission-expense.model';
import { initFundAllocationModel, FundAllocation } from './fund-allocation.model';
import { initNotificationModel, Notification } from './notification.model';
import { initAuditLogModel, AuditLog } from './audit-log.model';
import {
  initMissionApprovalHistoryModel,
  MissionApprovalHistory
} from './mission-approval-history.model';

export const sequelize = env.database.url
  ? new Sequelize(env.database.url, {
      dialect: 'postgres',
      logging: env.isDev ? console.log : false
    })
  : new Sequelize(env.database.dbName, env.database.username, env.database.password, {
      host: env.database.host,
      port: env.database.port,
      dialect: 'postgres',
      logging: env.isDev ? console.log : false
    });

const OrganizationModel = initOrganizationModel(sequelize);
const UserModel = initUserModel(sequelize);
const MissionRequestModel = initMissionRequestModel(sequelize);
const MissionExpenseModel = initMissionExpenseModel(sequelize);
const FundAllocationModel = initFundAllocationModel(sequelize);
const NotificationModel = initNotificationModel(sequelize);
const AuditLogModel = initAuditLogModel(sequelize);
const MissionApprovalHistoryModel = initMissionApprovalHistoryModel(sequelize);

// Associations
OrganizationModel.hasMany(UserModel, { foreignKey: 'organizationId' });
UserModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId' });

UserModel.hasMany(MissionRequestModel, { foreignKey: 'userId' });
MissionRequestModel.belongsTo(UserModel, { foreignKey: 'userId' });

MissionRequestModel.hasMany(MissionExpenseModel, { foreignKey: 'missionId' });
MissionExpenseModel.belongsTo(MissionRequestModel, { foreignKey: 'missionId' });

MissionRequestModel.hasMany(FundAllocationModel, { foreignKey: 'missionId' });
FundAllocationModel.belongsTo(MissionRequestModel, { foreignKey: 'missionId' });

UserModel.hasMany(NotificationModel, { foreignKey: 'userId' });
NotificationModel.belongsTo(UserModel, { foreignKey: 'userId' });

MissionRequestModel.hasMany(MissionApprovalHistoryModel, { foreignKey: 'missionId', as: 'missionApprovalHistories' });
MissionApprovalHistoryModel.belongsTo(MissionRequestModel, { foreignKey: 'missionId', as: 'mission' });

UserModel.hasMany(MissionApprovalHistoryModel, { foreignKey: 'approverId' });
MissionApprovalHistoryModel.belongsTo(UserModel, { foreignKey: 'approverId' });

export const models = {
  Organization: OrganizationModel,
  User: UserModel,
  MissionRequest: MissionRequestModel,
  MissionExpense: MissionExpenseModel,
  FundAllocation: FundAllocationModel,
  Notification: NotificationModel,
  AuditLog: AuditLogModel,
  MissionApprovalHistory: MissionApprovalHistoryModel
};

