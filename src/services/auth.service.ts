import { organizationRepository } from '../repositories/organization.repository';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail } from '../jobs/emailJob';
import { organizationRegistrationTemplate } from '../utils/emailTemplates';
import { auditLogRepository } from '../repositories/audit-log.repository';

interface RegisterOrganizationInput {
  name: string;
  province: string;
  district: string;
  sector: string;
  email: string;
  phone: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  password: string;
  proofDocument?: string | null;
}

export class AuthService {
  async registerOrganization(payload: RegisterOrganizationInput) {
    const existing = await organizationRepository.findOne({ where: { email: payload.email } });
    if (existing) {
      throw new Error('Organization already registered with this email');
    }

    const passwordHash = await hashPassword(payload.password);
    const organization = await organizationRepository.create({
      name: payload.name,
      province: payload.province,
      district: payload.district,
      sector: payload.sector,
      email: payload.email,
      phone: payload.phone,
      contactPersonName: payload.contactPersonName,
      contactPersonPhone: payload.contactPersonPhone,
      contactPersonEmail: payload.contactPersonEmail,
      passwordHash,
      proofDocument: payload.proofDocument || null,
      status: 'pending'
    });

    const adminUser = await userRepository.create({
      fullName: payload.contactPersonName,
      email: payload.contactPersonEmail,
      passwordHash,
      role: 'admin',
      organizationId: organization.id,
      status: 'disabled'
    });

    await sendEmail({
      to: payload.contactPersonEmail,
      ...organizationRegistrationTemplate(payload.contactPersonName)
    });

    await auditLogRepository.create({
      userId: adminUser.id,
      action: 'register',
      module: 'organization',
      newValue: organization.toJSON() as unknown as Record<string, unknown>
    });

    return organization;
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    if (user.status === 'disabled') {
      throw new Error('Account disabled');
    }

    const passwordsMatch = await comparePassword(password, user.passwordHash);
    if (!passwordsMatch) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload: { sub: string; role: string; organizationId?: string } = {
      sub: user.id,
      role: user.role
    };
    if (user.organizationId) {
      tokenPayload.organizationId = user.organizationId;
    }
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const refreshedPayload: { sub: string; role: string; organizationId?: string } = {
      sub: payload.sub,
      role: payload.role
    };
    if (payload.organizationId) {
      refreshedPayload.organizationId = payload.organizationId;
    }
    const accessToken = generateAccessToken(refreshedPayload);
    return { accessToken };
  }
}

export const authService = new AuthService();

