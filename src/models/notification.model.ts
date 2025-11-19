import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './user.model';

export interface NotificationAttributes {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'isRead'>;

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public message!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initNotificationModel = (sequelize: Sequelize): typeof Notification => {
  Notification.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'notifications',
      modelName: 'Notification'
    }
  );

  return Notification;
};



