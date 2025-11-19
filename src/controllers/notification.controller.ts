import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { successResponse } from '../utils/apiResponse';

export class NotificationController {
  list = async (req: Request, res: Response) => {
    const notifications = await notificationService.listByUser(req.user!.id);
    return successResponse(res, 200, 'Notifications retrieved', notifications);
  };

  markRead = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const notification = await notificationService.markAsRead(id, req.user!.id);
    return successResponse(res, 200, 'Notification updated', notification);
  };
}

export const notificationController = new NotificationController();

