import { Request, Response } from 'express';
import { bookingsService } from './bookings.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createBookingSchema, updateBookingStatusSchema, paginationSchema } from './bookings.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery, AuthPayload } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await bookingsService.list(req.query as unknown as RequestQuery, req.user!);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingsService.getById(req.params.id, req.user!);
    res.json({ data: booking });
  }),
];

export const create = [
  validateBody(createBookingSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingsService.create(req.body, req.user!);
    res.status(201).json({ data: booking });
  }),
];

export const updateStatus = [
  validateBody(updateBookingStatusSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingsService.updateStatus(req.params.id, req.body.status, req.user!, req.body.cancelReason);
    res.json({ data: booking });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await bookingsService.delete(req.params.id, req.user!);
    res.json({ data: { message: 'Booking deleted' } });
  }),
];
