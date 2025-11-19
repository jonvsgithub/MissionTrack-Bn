import { Request, Response } from 'express';
import { fundAllocationService } from '../services/fund-allocation.service';
import { successResponse } from '../utils/apiResponse';

export class FinanceController {
  allocateFunds = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const allocation = await fundAllocationService.allocate(id, req.user!.id, req.body);
    return successResponse(res, 201, 'Funds allocated', allocation);
  };
}

export const financeController = new FinanceController();

