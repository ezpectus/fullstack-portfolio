import { z } from 'zod';

export const createPayslipSchema = z.object({
  employeeId: z.string().uuid(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  baseSalary: z.number().min(0),
  bonus: z.number().min(0).default(0),
  allowances: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
});

export const updatePayslipSchema = z.object({
  baseSalary: z.number().min(0).optional(),
  bonus: z.number().min(0).optional(),
  allowances: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'PAID']).optional(),
});

export const listPayslipSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  employeeId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'PAID']).optional(),
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2000).optional(),
});
