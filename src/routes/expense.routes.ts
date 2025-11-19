import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createExpenseSchema } from './validators/expense.schemas';
import { upload } from '../middlewares/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post(
  '/missions/:id/expenses',
  authenticate,
  upload.single('receipt'),
  validate(createExpenseSchema),
  asyncHandler(expenseController.create)
);

router.patch(
  '/expenses/:id/approve',
  authenticate,
  requireRoles(['finance']),
  asyncHandler(expenseController.approve)
);

router.patch(
  '/expenses/:id/reject',
  authenticate,
  requireRoles(['finance']),
  asyncHandler(expenseController.reject)
);

export const expenseRoutes = router;



