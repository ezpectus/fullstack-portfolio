import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  managerId: z.string().uuid().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  managerId: z.string().uuid().optional().nullable(),
});

export const listDepartmentsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
});
