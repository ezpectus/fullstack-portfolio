import { z } from 'zod';

export const createWorkingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isBreak: z.boolean().default(false),
});

export const createTimeOffSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().optional(),
});

export const listScheduleQuerySchema = z.object({
  doctorId: z.string().uuid(),
  date: z.string().optional(),
});

export const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(5).default(30),
  price: z.number().min(0).default(0),
});

export type CreateWorkingHoursInput = z.infer<typeof createWorkingHoursSchema>;
export type CreateTimeOffInput = z.infer<typeof createTimeOffSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
