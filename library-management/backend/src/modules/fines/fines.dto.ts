import { z } from 'zod';

export const idParamSchema = z.object({ id: z.string().uuid() });

export const finePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['PENDING', 'PAID', 'WAIVED']).optional(),
  memberId: z.string().uuid().optional(),
});
