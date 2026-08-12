import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
  })).min(1),
});

export const updatePurchaseOrderSchema = z.object({
  supplierId: z.string().uuid().optional(),
  warehouseId: z.string().uuid().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
  })).optional(),
});

export const updatePurchaseOrderStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'RECEIVED', 'CANCELLED']),
});

export const purchaseOrderPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'SENT', 'RECEIVED', 'CANCELLED']).optional(),
  supplierId: z.string().uuid().optional(),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;
export type UpdatePurchaseOrderStatusInput = z.infer<typeof updatePurchaseOrderStatusSchema>;
export type PurchaseOrderPaginationInput = z.infer<typeof purchaseOrderPaginationSchema>;
