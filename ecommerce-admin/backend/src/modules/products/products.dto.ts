import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('DRAFT'),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  variants: z.array(z.object({
    sku: z.string().min(3),
    name: z.string().min(2),
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    price: z.number().min(0),
    stock: z.number().int().min(0).default(0),
  })).optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    position: z.number().int().default(0),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
