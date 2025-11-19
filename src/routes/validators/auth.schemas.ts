import { z } from 'zod';

export const registerOrganizationSchema = z.object({
  name: z.string().min(3),
  province: z.string(),
  district: z.string(),
  sector: z.string(),
  email: z.string().email(),
  phone: z.string(),
  contactPersonName: z.string(),
  contactPersonPhone: z.string(),
  contactPersonEmail: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const refreshSchema = z.object({
  refreshToken: z.string()
});



