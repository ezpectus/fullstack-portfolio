import { Request, Response } from 'express';
import { servicesService } from './services.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createServiceSchema, updateServiceSchema, paginationSchema } from './services.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await servicesService.list(req.query as unknown as RequestQuery);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.getById(req.params.id);
    res.json({ data: service });
  }),
];

export const create = [
  validateBody(createServiceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.create(req.body);
    res.status(201).json({ data: service });
  }),
];

export const update = [
  validateBody(updateServiceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.update(req.params.id, req.body);
    res.json({ data: service });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await servicesService.delete(req.params.id);
    res.status(204).json({ data: { message: 'Service deleted' } });
  }),
];
