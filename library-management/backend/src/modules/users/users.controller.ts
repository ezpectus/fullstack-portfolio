import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { usersService } from './users.service';

import { Role } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await usersService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    search: req.query.search as string | undefined,
    role: req.query.role as Role | undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.getById(req.params.id);
  res.json(user);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(user);
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await usersService.delete(req.params.id);
  res.status(204).send();
});
