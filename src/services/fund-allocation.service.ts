import { fundAllocationRepository } from '../repositories/fund-allocation.repository';
import { missionRepository } from '../repositories/mission.repository';

interface AllocateFundsInput {
  allocatedAmount: number;
}

export class FundAllocationService {
  async allocate(missionId: string, allocatedBy: string, payload: AllocateFundsInput) {
    const mission = await missionRepository.findById(missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }
    return fundAllocationRepository.create({
      missionId,
      allocatedAmount: payload.allocatedAmount,
      allocatedBy,
      status: 'pending'
    } as any);
  }

  listByMission(missionId: string) {
    return fundAllocationRepository.findAll({ where: { missionId } });
  }
}

export const fundAllocationService = new FundAllocationService();



