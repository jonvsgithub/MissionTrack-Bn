import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { notificationController } from '../controllers/notification.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(notificationController.list));
router.patch('/:id/read', asyncHandler(notificationController.markRead));

export const notificationRoutes = router;



