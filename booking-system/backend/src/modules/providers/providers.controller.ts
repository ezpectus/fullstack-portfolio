import { Request, Response } from 'express';
import { providersService } from './providers.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createProviderSchema, updateProviderSchema, paginationSchema } from './providers.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query) as unknown as RequestQuery;
    const result = await providersService.list(query);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const provider = await providersService.getById(req.params.id);
    res.json({ data: provider });
  }),
];

export const create = [
  validateBody(createProviderSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const provider = await providersService.create(req.body);
    res.status(201).json({ data: provider });
  }),
];

export const update = [
  validateBody(updateProviderSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const provider = await providersService.update(req.params.id, req.body);
    res.json({ data: provider });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await providersService.delete(req.params.id);
    res.json({ data: { message: 'Provider deleted' } });
  }),
];
