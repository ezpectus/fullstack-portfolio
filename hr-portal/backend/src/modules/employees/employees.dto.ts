import { z } from 'zod';

export const createEmployeeSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  phone: z.string().optional(),
  photo: z.string().optional(),
  position: z.string().min(1),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  hireDate: z.coerce.date(),
  salary: z.number().min(0).default(0),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
  position: z.string().min(1).optional(),
  departmentId: z.string().uuid().optional().nullable(),
  managerId: z.string().uuid().optional().nullable(),
  salary: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  terminationDate: z.coerce.date().optional().nullable(),
});

export const listEmployeesSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
});
