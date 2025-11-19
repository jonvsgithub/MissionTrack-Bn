import { organizationRepository } from '../repositories/organization.repository';
import { userRepository } from '../repositories/user.repository';
import { auditLogRepository } from '../repositories/audit-log.repository';

export class OrganizationService {
  listPending() {
    return organizationRepository.findPending();
  }

  async approve(id: string, adminId: string) {
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    await organizationRepository.update(id, { status: 'approved', createdByAdminId: adminId });

    const adminUser = await userRepository.findByEmail(organization.contactPersonEmail);
    if (adminUser) {
      await userRepository.update(adminUser.id, { status: 'active' } as any);
    }
    await auditLogRepository.create({
      userId: adminId,
      action: 'approve',
      module: 'organization',
      oldValue: organization.toJSON() as unknown as Record<string, unknown>,
      newValue: { status: 'approved' }
    });
    return organizationRepository.findById(id);
  }
}

export const organizationService = new OrganizationService();

