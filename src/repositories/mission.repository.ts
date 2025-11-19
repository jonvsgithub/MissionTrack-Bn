import { FindOptions } from 'sequelize';
import { BaseRepository } from './base.repository';
import { MissionRequest } from '../models/mission-request.model';

class MissionRepository extends BaseRepository<MissionRequest> {
  constructor() {
    super(MissionRequest);
  }

  listByOrganization(organizationId: string, options?: FindOptions) {
    const finalOptions: FindOptions = {
      ...(options || {}),
      where: { ...(options?.where || {}), organizationId }
    };
    return this.model.findAll(finalOptions);
  }
}

export const missionRepository = new MissionRepository();

