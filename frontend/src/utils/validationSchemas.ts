import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerOrganizationSchema = z.object({
  name: z.string().min(2),
  province: z.string().min(2),
  district: z.string().min(2),
  sector: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  contactPersonName: z.string().min(2),
  contactPersonPhone: z.string().min(6),
  contactPersonEmail: z.string().email(),
  password: z.string().min(8)
});

export const missionSchema = z.object({
  purpose: z.string().min(3),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.coerce.number().int().positive(),
  estimatedCost: z.coerce.number().positive()
});

export const createUserSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['employee', 'manager', 'hr', 'finance', 'admin']),
  phone: z.string().optional(),
  department: z.string().optional(),
  organizationId: z.string().optional()
});

