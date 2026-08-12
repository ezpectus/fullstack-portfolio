import { z } from 'zod';

export const createDealSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  amount: z.number().min(0).optional().default(0),
  currency: z.string().length(3).optional().default('USD'),
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional().default('new'),
  probability: z.number().min(0).max(100).optional().default(0),
  expectedCloseDate: z.string().datetime().optional(),
  customerId: z.string().uuid('Invalid customer ID'),
  assignedToId: z.string().uuid().optional(),
});

export const updateDealSchema = createDealSchema.partial().omit({ customerId: true });

export const dealQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  search: z.string().optional(),
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional(),
  customerId: z.string().uuid().optional(),
  sortBy: z.enum(['title', 'amount', 'createdAt', 'updatedAt', 'expectedCloseDate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;
