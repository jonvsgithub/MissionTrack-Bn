import { Router } from 'express';
import { financeController } from '../controllers/finance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { fundAllocationSchema } from './validators/fund.schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post(
  '/missions/:id/fund-allocation',
  authenticate,
  requireRoles(['finance']),
  validate(fundAllocationSchema),
  asyncHandler(financeController.allocateFunds)
);

export const financeRoutes = router;



