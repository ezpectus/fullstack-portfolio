import { z } from 'zod';

export const sendNotificationSchema = z.object({
  bookingId: z.string().min(1),
  type: z.enum(['CONFIRMATION', 'REMINDER', 'CANCELLATION']),
});

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['PENDING', 'SENT', 'FAILED']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
