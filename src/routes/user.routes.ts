import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateUserStatusSchema } from './validators/user.schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(userController.listUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.patch('/:id/status', validate(updateUserStatusSchema), asyncHandler(userController.updateUserStatus));

export const userRoutes = router;



