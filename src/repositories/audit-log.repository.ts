import { BaseRepository } from './base.repository';
import { AuditLog } from '../models/audit-log.model';

class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super(AuditLog);
  }
}

export const auditLogRepository = new AuditLogRepository();



