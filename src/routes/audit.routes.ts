import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { auditController } from '../controllers/audit.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticate, requireRoles(['admin']), asyncHandler(auditController.list));

export const auditRoutes = router;



