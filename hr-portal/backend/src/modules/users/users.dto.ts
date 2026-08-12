import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const listUsersSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  role: z.enum(['HR_ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
});
