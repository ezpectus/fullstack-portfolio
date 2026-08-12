import { Request, Response } from 'express';
import { usersService } from './users.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export class UsersController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await usersService.list(page, limit, search);
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getById(req.params.id);
    res.json({ data: user });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.update(req.params.id, req.body);
    res.json({ data: user, message: 'User updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await usersService.delete(req.params.id);
    res.status(204).send();
  });
}

export const usersController = new UsersController();
