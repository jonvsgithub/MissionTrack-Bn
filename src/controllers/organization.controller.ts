import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { successResponse } from '../utils/apiResponse';

export class OrganizationController {
  listPending = async (_req: Request, res: Response) => {
    const organizations = await organizationService.listPending();
    return successResponse(res, 200, 'Pending organizations', organizations);
  };

  approve = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const organization = await organizationService.approve(id, req.user!.id);
    return successResponse(res, 200, 'Organization approved', organization);
  };
}

export const organizationController = new OrganizationController();

