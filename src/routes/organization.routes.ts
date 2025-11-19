import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/pending',
  authenticate,
  requireRoles(['admin']),
  asyncHandler(organizationController.listPending)
);

router.patch(
  '/:id/approve',
  authenticate,
  requireRoles(['admin']),
  asyncHandler(organizationController.approve)
);

export const organizationRoutes = router;



