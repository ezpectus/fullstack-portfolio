import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().positive().default(1),
  unit: z.string().default('pcs'),
  unitPrice: z.number().nonnegative().default(0),
  taxRate: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templatePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});
