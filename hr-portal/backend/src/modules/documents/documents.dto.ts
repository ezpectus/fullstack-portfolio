import { z } from 'zod';

export const createDocumentSchema = z.object({
  employeeId: z.string().uuid(),
  type: z.enum(['EMPLOYMENT_CONTRACT', 'HIRE_ORDER', 'LEAVE_ORDER', 'CERTIFICATE']),
  title: z.string().min(1),
  content: z.string().optional(),
});

export const listDocumentsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  employeeId: z.string().uuid().optional(),
  type: z.enum(['EMPLOYMENT_CONTRACT', 'HIRE_ORDER', 'LEAVE_ORDER', 'CERTIFICATE']).optional(),
});
