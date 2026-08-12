import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'LIBRARIAN', 'MEMBER']).optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'LIBRARIAN', 'MEMBER']).optional(),
});
