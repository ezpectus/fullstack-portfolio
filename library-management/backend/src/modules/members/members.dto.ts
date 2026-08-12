import { z } from 'zod';

export const updateMemberSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED']).optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const memberPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED']).optional(),
});
