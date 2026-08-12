import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  headDoctorId: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const listDepartmentsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});
