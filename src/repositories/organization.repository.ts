import { BaseRepository } from './base.repository';
import { Organization } from '../models/organization.model';

class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    super(Organization);
  }

  findPending() {
    return this.model.findAll({ where: { status: 'pending' } });
  }
}

export const organizationRepository = new OrganizationRepository();



