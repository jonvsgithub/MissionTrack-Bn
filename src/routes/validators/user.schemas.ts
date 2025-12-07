import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['employee', 'manager', 'hr', 'finance', 'admin']),
  organizationId: z.string().uuid().optional(),
  phone: z.string().optional(),
  department: z.string().optional()
});

export const updateUserSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['active', 'disabled']).optional()
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'disabled']).describe('User status'),
  }),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const assignRoleSchema = z.object({
  role: z.enum(['employee', 'manager', 'hr', 'finance', 'admin'])
});



