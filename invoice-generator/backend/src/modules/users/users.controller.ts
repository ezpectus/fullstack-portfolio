import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { usersService } from './users.service';

export const listUsers = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;
  const result = await usersService.list(page, limit, search);
  res.json(result);
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await usersService.getById(req.params.id);
  res.json(user);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await usersService.delete(req.params.id);
  res.json({ message: 'User deleted' });
});
