import { z } from 'zod';

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  isRead: z.enum(['true', 'false']).optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'MEDICAL_RECORD_UPDATED', 'WELCOME']),
  title: z.string().min(1),
  message: z.string().min(1),
  appointmentId: z.string().uuid().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
