import { z } from 'zod';

export const createDoctorSchema = z.object({
  userId: z.string().uuid(),
  departmentId: z.string().uuid().optional(),
  specialization: z.string().min(2),
  bio: z.string().optional(),
  consultationFee: z.number().min(0).default(0),
});

export const updateDoctorSchema = z.object({
  departmentId: z.string().uuid().optional(),
  specialization: z.string().min(2).optional(),
  bio: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const listDoctorsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  departmentId: z.string().uuid().optional(),
  search: z.string().optional(),
});
