import { z } from 'zod';

export const createBookSchema = z.object({
  isbn: z.string().min(10),
  title: z.string().min(1),
  authors: z.string().min(1),
  publisher: z.string().optional(),
  publishYear: z.number().int().min(1000).max(2100).optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional(),
  categoryId: z.string().uuid().optional(),
});

export const updateBookSchema = createBookSchema.partial();

export const idParamSchema = z.object({ id: z.string().uuid() });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  genre: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  sortBy: z.enum(['title', 'publishYear', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
