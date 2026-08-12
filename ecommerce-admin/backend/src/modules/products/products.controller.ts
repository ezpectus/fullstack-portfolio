import { Request, Response } from 'express';
import { productsService } from './products.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createProductSchema, updateProductSchema, paginationSchema } from './products.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AuthRequest } from '../../middleware/auth';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await productsService.list(req.query as any);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.getById(req.params.id);
    res.json({ data: product });
  }),
];

export const create = [
  validateBody(createProductSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productsService.create(req.body, req.user!.id);
    res.status(201).json({ data: product });
  }),
];

export const update = [
  validateBody(updateProductSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.update(req.params.id, req.body);
    res.json({ data: product });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await productsService.delete(req.params.id);
    res.status(204).json({ data: { message: 'Product deleted' } });
  }),
];
