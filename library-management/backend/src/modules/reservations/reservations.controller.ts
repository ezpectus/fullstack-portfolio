import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { reservationsService } from './reservations.service';

import { ReservationStatus } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await reservationsService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    status: req.query.status as ReservationStatus | undefined,
    memberId: req.query.memberId as string | undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reservation = await reservationsService.getById(req.params.id);
  res.json(reservation);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reservation = await reservationsService.create(req.body, req.user!.id);
  res.status(201).json(reservation);
});

export const cancel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reservation = await reservationsService.cancel(req.params.id, req.user!.id);
  res.json(reservation);
});

export const fulfill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reservation = await reservationsService.fulfill(req.params.id, req.body.bookCopyId);
  res.json(reservation);
});
