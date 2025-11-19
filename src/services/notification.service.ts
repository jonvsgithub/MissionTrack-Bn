import { notificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  listByUser(userId: string) {
    return notificationRepository.findAll({ where: { userId } });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }
    await notificationRepository.update(id, { isRead: true } as any);
    return notificationRepository.findById(id);
  }
}

export const notificationService = new NotificationService();



