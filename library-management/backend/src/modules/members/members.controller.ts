import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { membersService } from './members.service';

import { MemberStatus } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await membersService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    search: req.query.search as string | undefined,
    status: req.query.status as MemberStatus | undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const member = await membersService.getById(req.params.id);
  res.json(member);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const member = await membersService.update(req.params.id, req.body);
  res.json(member);
});

export const getLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loans = await membersService.getLoans(req.params.id);
  res.json(loans);
});

export const getFines = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fines = await membersService.getFines(req.params.id);
  res.json(fines);
});
