import { z } from 'zod';

export const createReservationSchema = z.object({
  bookId: z.string().uuid(),
});

export const fulfillReservationSchema = z.object({
  bookCopyId: z.string().uuid(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const reservationPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['PENDING', 'FULFILLED', 'CANCELLED', 'EXPIRED']).optional(),
  memberId: z.string().uuid().optional(),
});
