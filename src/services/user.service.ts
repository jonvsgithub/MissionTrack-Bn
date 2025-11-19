import { userRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/password';
import { auditLogRepository } from '../repositories/audit-log.repository';

interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  role: string;
  organizationId?: string;
  phone?: string;
  department?: string;
}

interface UpdateUserInput {
  fullName?: string;
  phone?: string;
  department?: string;
  status?: 'active' | 'disabled';
}

export class UserService {
  async createUser(payload: CreateUserInput, performedBy: string) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    const passwordHash = await hashPassword(payload.password);
    const user = await userRepository.create({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash,
      role: payload.role as any,
      organizationId: payload.organizationId,
      phone: payload.phone ?? null,
      department: payload.department ?? null,
      status: 'active'
    });
    await auditLogRepository.create({
      userId: performedBy,
      action: 'create',
      module: 'user',
      newValue: user.toJSON() as unknown as Record<string, unknown>
    });
    return user;
  }

  async updateUser(id: string, payload: UpdateUserInput, performedBy: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await userRepository.update(id, payload as any);
    await auditLogRepository.create({
      userId: performedBy,
      action: 'update',
      module: 'user',
      oldValue: user.toJSON() as unknown as Record<string, unknown>,
      newValue: payload as Record<string, unknown>
    });
    return userRepository.findById(id);
  }

  async assignRole(id: string, role: string, performedBy: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await userRepository.update(id, { role } as any);
    await auditLogRepository.create({
      userId: performedBy,
      action: 'assignRole',
      module: 'user',
      oldValue: user.toJSON() as unknown as Record<string, unknown>,
      newValue: { role }
    });
    return userRepository.findById(id);
  }

  async disableUser(id: string, performedBy: string) {
    return this.updateUser(id, { status: 'disabled' }, performedBy);
  }

  listUsers() {
    return userRepository.findAll();
  }
}

export const userService = new UserService();

