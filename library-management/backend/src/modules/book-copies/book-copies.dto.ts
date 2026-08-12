import { z } from 'zod';

export const createCopySchema = z.object({
  bookId: z.string().uuid(),
  code: z.string().min(1),
  condition: z.string().default('good'),
});

export const updateCopySchema = z.object({
  status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED', 'LOST', 'DAMAGED']).optional(),
  condition: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const copyPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  bookId: z.string().uuid().optional(),
  status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED', 'LOST', 'DAMAGED']).optional(),
});
