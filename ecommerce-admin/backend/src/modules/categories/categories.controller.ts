import { Request, Response } from 'express';
import { categoriesService } from './categories.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createCategorySchema, updateCategorySchema, paginationSchema } from './categories.dto';
import { asyncHandler } from '../../middleware/asyncHandler';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await categoriesService.list(req.query as any);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const tree = [
  asyncHandler(async (_req: Request, res: Response) => {
    const tree = await categoriesService.tree();
    res.json({ data: tree });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.getById(req.params.id);
    res.json({ data: category });
  }),
];

export const create = [
  validateBody(createCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.create(req.body);
    res.status(201).json({ data: category });
  }),
];

export const update = [
  validateBody(updateCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.update(req.params.id, req.body);
    res.json({ data: category });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await categoriesService.delete(req.params.id);
    res.status(204).json({ data: { message: 'Category deleted' } });
  }),
];
