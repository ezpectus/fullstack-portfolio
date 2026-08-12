import { z } from 'zod';

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
