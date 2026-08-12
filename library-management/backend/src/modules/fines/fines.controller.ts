import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { finesService } from './fines.service';

import { FineStatus } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await finesService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    status: req.query.status as FineStatus | undefined,
    memberId: req.query.memberId as string | undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fine = await finesService.getById(req.params.id);
  res.json(fine);
});

export const pay = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fine = await finesService.pay(req.params.id);
  res.json(fine);
});

export const waive = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fine = await finesService.waive(req.params.id);
  res.json(fine);
});
