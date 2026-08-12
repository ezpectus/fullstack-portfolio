import { Request, Response } from 'express';
import { userService } from './users.service';
import { createUserSchema, updateUserSchema } from './users.dto';
import { validateBody } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class UserController {
  list = [asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await userService.list(page, limit, search);
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createUserSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.create(req.body);
    res.status(201).json(result);
  })];

  update = [validateBody(updateUserSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.update(req.params.id, req.body);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await userService.delete(req.params.id);
    res.status(204).send();
  })];
}

export const userController = new UserController();
