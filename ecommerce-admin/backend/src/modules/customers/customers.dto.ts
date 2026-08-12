import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'BLOCKED']).default('ACTIVE'),
  segment: z.enum(['VIP', 'REGULAR', 'NEW']).default('NEW'),
  addresses: z.array(z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().default('USA'),
    isDefault: z.boolean().default(false),
  })).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  segment: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
