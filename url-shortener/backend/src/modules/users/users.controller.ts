import { Request, Response } from 'express';
import { usersService } from './users.service';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';

export const usersController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await usersService.list(page, limit);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getById(req.params.id);
    res.json(user);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await usersService.update(req.params.id, req.body);
    res.json(user);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await usersService.delete(req.params.id);
    res.json(result);
  }),
};
