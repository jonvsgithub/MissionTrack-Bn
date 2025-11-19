import { BaseRepository } from './base.repository';
import { Notification } from '../models/notification.model';

class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }
}

export const notificationRepository = new NotificationRepository();



