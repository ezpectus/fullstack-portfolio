import { z } from 'zod';

export const createLinkSchema = z.object({
  originalUrl: z.string().url('Must be a valid URL'),
  alias: z.string().min(3).max(30).optional(),
  expiresAt: z.string().datetime().optional(),
  password: z.string().min(4).optional(),
});

export const updateLinkSchema = z.object({
  originalUrl: z.string().url('Must be a valid URL').optional(),
  alias: z.string().min(3).max(30).optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  password: z.string().min(4).nullable().optional(),
  status: z.enum(['active', 'disabled', 'archived']).optional(),
});

export const linkQuerySchema = z.object({
  page: z.string().optional().transform(Number).pipe(z.number().min(1).default(1)),
  limit: z.string().optional().transform(Number).pipe(z.number().min(1).max(100).default(20)),
  search: z.string().optional(),
  status: z.enum(['active', 'expired', 'disabled', 'archived']).optional(),
  sort: z.enum(['createdAt', 'originalUrl', 'shortCode']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const bulkCreateSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(100),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
