import { Request, Response } from 'express';
import { auditLogService } from '../services/audit-log.service';
import { successResponse } from '../utils/apiResponse';

export class AuditController {
  list = async (_req: Request, res: Response) => {
    const logs = await auditLogService.list();
    return successResponse(res, 200, 'Audit logs retrieved', logs);
  };
}

export const auditController = new AuditController();



