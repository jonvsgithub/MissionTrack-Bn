import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { organizationRoutes } from './organization.routes';
import { userRoutes } from './user.routes';
import { missionRoutes } from './mission.routes';
import { expenseRoutes } from './expense.routes';
import { financeRoutes } from './finance.routes';
import { notificationRoutes } from './notification.routes';
import { auditRoutes } from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/missions', missionRoutes);
router.use('/', expenseRoutes);
router.use('/', financeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit-logs', auditRoutes);

export const apiRouter = router;



