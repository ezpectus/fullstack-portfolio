import { Request, Response } from 'express';
import { usersService } from './users.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { updateUserSchema, paginationSchema } from './users.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await usersService.list(req.query as unknown as RequestQuery);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getById(req.params.id);
    res.json({ data: user });
  }),
];

export const update = [
  validateBody(updateUserSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.update(req.params.id, req.body);
    res.json({ data: user });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await usersService.delete(req.params.id);
    res.json({ data: { message: 'User deleted' } });
  }),
];
