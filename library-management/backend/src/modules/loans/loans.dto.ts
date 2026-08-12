import { z } from 'zod';

export const createLoanSchema = z.object({
  bookCopyId: z.string().uuid(),
  memberId: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const loanPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  memberId: z.string().uuid().optional(),
  bookCopyId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'RETURNED', 'OVERDUE']).optional(),
});
