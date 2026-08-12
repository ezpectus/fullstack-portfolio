import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().min(5),
  price: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  categoryId: z.string().uuid().optional().nullable(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
