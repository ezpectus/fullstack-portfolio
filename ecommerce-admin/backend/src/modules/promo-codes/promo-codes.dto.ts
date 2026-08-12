import { z } from 'zod';

export const createPromoSchema = z.object({
  code: z.string().min(3).max(50),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().min(0),
  minOrderValue: z.number().min(0).default(0),
  usageLimit: z.number().int().min(1).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updatePromoSchema = createPromoSchema.partial();

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  isActive: z.string().optional(),
});

export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>;
