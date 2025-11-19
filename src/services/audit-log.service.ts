import { auditLogRepository } from '../repositories/audit-log.repository';

export class AuditLogService {
  list() {
    return auditLogRepository.findAll({
      order: [['createdAt', 'DESC']]
    } as any);
  }
}

export const auditLogService = new AuditLogService();



