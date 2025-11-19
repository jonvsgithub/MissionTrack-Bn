import { Request, Response } from 'express';
import { missionService } from '../services/mission.service';
import { successResponse } from '../utils/apiResponse';

export class MissionController {
  create = async (req: Request, res: Response) => {
    const mission = await missionService.createMission(req.user!.id, req.body);
    return successResponse(res, 201, 'Mission created', mission);
  };

  list = async (_req: Request, res: Response) => {
    const missions = await missionService.listMissions();
    return successResponse(res, 200, 'Missions retrieved', missions);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const mission = await missionService.getMission(id);
    return successResponse(res, 200, 'Mission retrieved', mission);
  };

  approve = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const mission = await missionService.approveMission(id, req.user!.role, req.user!.id, req.body.comment);
    return successResponse(res, 200, 'Mission approved', mission);
  };

  reject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const mission = await missionService.rejectMission(id, req.user!.id, req.user!.role, req.body.comment);
    return successResponse(res, 200, 'Mission rejected', mission);
  };
}

export const missionController = new MissionController();

