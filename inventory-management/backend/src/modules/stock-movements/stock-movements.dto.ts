import { z } from 'zod';

export const createMovementSchema = z.object({
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  type: z.enum(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT']),
  quantity: z.number().int().min(1),
  fromWarehouseId: z.string().uuid().optional(),
  comment: z.string().optional(),
});

export const movementPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productId: z.string().uuid().optional(),
  warehouseId: z.string().uuid().optional(),
  type: z.enum(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>;
export type MovementPaginationInput = z.infer<typeof movementPaginationSchema>;
