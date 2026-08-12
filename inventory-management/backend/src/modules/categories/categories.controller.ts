import { Request, Response } from 'express';
import { categoryService } from './categories.service';
import { createCategorySchema, updateCategorySchema } from './categories.dto';
import { validateBody } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class CategoryController {
  list = [asyncHandler(async (_req: Request, res: Response) => {
    const result = await categoryService.getTree();
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createCategorySchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.create(req.body);
    res.status(201).json(result);
  })];

  update = [validateBody(updateCategorySchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.update(req.params.id, req.body);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await categoryService.delete(req.params.id);
    res.status(204).send();
  })];
}

export const categoryController = new CategoryController();
