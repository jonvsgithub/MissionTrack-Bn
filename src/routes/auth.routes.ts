import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { registerOrganizationSchema, loginSchema, refreshSchema } from './validators/auth.schemas';
import { upload } from '../middlewares/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post(
  '/register-organization',
  upload.single('proofDocument'),
  validate(registerOrganizationSchema),
  asyncHandler(authController.registerOrganization)
);

router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(authController.refresh));

export const authRoutes = router;



