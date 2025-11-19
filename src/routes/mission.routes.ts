import { Router } from 'express';
import { missionController } from '../controllers/mission.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createMissionSchema, missionDecisionSchema } from './validators/mission.schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(createMissionSchema), asyncHandler(missionController.create));
router.get('/', asyncHandler(missionController.list));
router.get('/:id', asyncHandler(missionController.getById));
router.patch('/:id/approve', validate(missionDecisionSchema), asyncHandler(missionController.approve));
router.patch('/:id/reject', validate(missionDecisionSchema), asyncHandler(missionController.reject));

export const missionRoutes = router;



