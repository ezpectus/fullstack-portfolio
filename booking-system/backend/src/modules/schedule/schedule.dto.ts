import { z } from 'zod';

export const blockSlotsSchema = z.object({
  providerId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().optional(),
});

export const getSlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  serviceId: z.string().min(1),
});

export type BlockSlotsInput = z.infer<typeof blockSlotsSchema>;
export type GetSlotsInput = z.infer<typeof getSlotsSchema>;
