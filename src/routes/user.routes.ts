import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { createUserSchema, updateUserSchema, assignRoleSchema } from './validators/user.schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate, requireRoles(['admin']));

router.get('/', asyncHandler(userController.list));
router.post('/', validate(createUserSchema), asyncHandler(userController.create));
router.patch('/:id', validate(updateUserSchema), asyncHandler(userController.update));
router.patch('/:id/role', validate(assignRoleSchema), asyncHandler(userController.assignRole));
router.patch('/:id/disable', asyncHandler(userController.disable));

export const userRoutes = router;



