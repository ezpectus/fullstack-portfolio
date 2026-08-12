import { z } from 'zod';

export const createLeaveRequestSchema = z.object({
  employeeId: z.string().uuid(),
  leaveType: z.enum(['ANNUAL', 'SICK', 'UNPAID', 'MATERNITY']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  comment: z.string().optional(),
});

export const approveLeaveSchema = z.object({
  rejectionReason: z.string().optional(),
});

export const listLeaveSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  employeeId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
});

export const leaveCalendarSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  departmentId: z.string().uuid().optional(),
});
