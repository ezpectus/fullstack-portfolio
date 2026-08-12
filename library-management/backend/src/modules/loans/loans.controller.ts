import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { loansService } from './loans.service';

import { LoanStatus } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await loansService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    status: req.query.status as LoanStatus | undefined,
    memberId: req.query.memberId as string | undefined,
  });
  res.json(result);
});

export const listMy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await loansService.listMy({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    status: req.query.status as LoanStatus | undefined,
    userId: req.user!.id,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loan = await loansService.getById(req.params.id);
  res.json(loan);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loan = await loansService.create(req.body, req.user!.id);
  res.status(201).json(loan);
});

export const returnBook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loan = await loansService.returnBook(req.params.id);
  res.json(loan);
});

export const renew = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loan = await loansService.renew(req.params.id);
  res.json(loan);
});
