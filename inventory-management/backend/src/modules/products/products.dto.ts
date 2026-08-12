import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  unit: z.string().default('pcs'),
  minStock: z.number().int().min(0).default(0),
  costPrice: z.number().min(0).default(0),
  sellPrice: z.number().min(0).default(0),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  sortBy: z.enum(['name', 'sku', 'costPrice', 'sellPrice', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductPaginationInput = z.infer<typeof productPaginationSchema>;
