import { missionRepository } from '../repositories/mission.repository';
import { userRepository } from '../repositories/user.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { MissionRequest } from '../models/mission-request.model';
import { MissionApprovalHistory } from '../models/mission-approval-history.model';
import { auditLogRepository } from '../repositories/audit-log.repository';

interface CreateMissionInput {
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  estimatedCost: number;
}

const roleWorkflow: Record<string, { from: MissionRequest['status']; to: MissionRequest['status'] }> = {
  manager: { from: 'pending_manager', to: 'pending_hr' },
  hr: { from: 'pending_hr', to: 'pending_finance' },
  finance: { from: 'pending_finance', to: 'approved' }
};

export class MissionService {
  async createMission(userId: string, payload: CreateMissionInput) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const mission = await missionRepository.create({
      userId,
      organizationId: user.organizationId,
      purpose: payload.purpose,
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      duration: payload.duration,
      estimatedCost: payload.estimatedCost,
      status: 'pending_manager'
    } as any);
    await notificationRepository.create({
      userId,
      title: 'Mission submitted',
      message: `Mission "${mission.purpose}" submitted successfully`
    } as any);
    return mission;
  }

  listMissions() {
    return missionRepository.findAll({
      include: [{ model: MissionApprovalHistory, as: 'missionApprovalHistories' }]
    } as any);
  }

  getMission(id: string) {
    return missionRepository.findById(id, {
      include: [{ model: MissionApprovalHistory, as: 'missionApprovalHistories' }]
    });
  }

  async approveMission(id: string, role: string, approverId: string, comment?: string) {
    const mission = await missionRepository.findById(id);
    if (!mission) {
      throw new Error('Mission not found');
    }

    const workflow = roleWorkflow[role];
    if (!workflow || mission.status !== workflow.from) {
      throw new Error('You cannot approve this mission at the current stage');
    }

    await missionRepository.update(id, { status: workflow.to } as any);
    await MissionApprovalHistory.create({
      missionId: id,
      approverId,
      role,
      action: 'approved',
      comment: comment ?? null
    });
    await notificationRepository.create({
      userId: mission.userId,
      title: 'Mission update',
      message: `Mission "${mission.purpose}" is now ${workflow.to}`
    } as any);
    await auditLogRepository.create({
      userId: approverId,
      action: 'approve',
      module: 'mission',
      oldValue: mission.toJSON() as unknown as Record<string, unknown>,
      newValue: { status: workflow.to }
    });
    return missionRepository.findById(id);
  }

  async rejectMission(id: string, approverId: string, role: string, comment?: string) {
    const mission = await missionRepository.findById(id);
    if (!mission) {
      throw new Error('Mission not found');
    }
    await missionRepository.update(id, { status: 'rejected' } as any);
    await MissionApprovalHistory.create({
      missionId: id,
      approverId,
      role,
      action: 'rejected',
      comment: comment ?? null
    });
    await notificationRepository.create({
      userId: mission.userId,
      title: 'Mission rejected',
      message: `Mission "${mission.purpose}" was rejected`
    } as any);
    await auditLogRepository.create({
      userId: approverId,
      action: 'reject',
      module: 'mission',
      oldValue: mission.toJSON() as unknown as Record<string, unknown>,
      newValue: { status: 'rejected' }
    });
    return missionRepository.findById(id);
  }
}

export const missionService = new MissionService();

