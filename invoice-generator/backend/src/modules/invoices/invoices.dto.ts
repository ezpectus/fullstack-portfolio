import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive().default(1),
  unit: z.string().default('pcs'),
  unitPrice: z.number().nonnegative().default(0),
  taxRate: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().uuid(),
  issueDate: z.coerce.date().default(() => new Date()),
  dueDate: z.coerce.date(),
  currency: z.string().min(3).max(3).default('USD'),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
});

export const updateInvoiceSchema = z.object({
  clientId: z.string().uuid().optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  currency: z.string().min(3).max(3).optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const invoiceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
});

export const invoicePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  clientId: z.string().uuid().optional(),
  sortBy: z.enum(['number', 'issueDate', 'dueDate', 'total', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
