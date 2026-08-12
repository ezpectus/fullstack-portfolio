import { Request, Response } from 'express';
import { customersService } from './customers.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createCustomerSchema, updateCustomerSchema, paginationSchema } from './customers.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await customersService.list(req.query as unknown as RequestQuery);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.getById(req.params.id);
    res.json({ data: customer });
  }),
];

export const create = [
  validateBody(createCustomerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.create(req.body);
    res.status(201).json({ data: customer });
  }),
];

export const update = [
  validateBody(updateCustomerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.update(req.params.id, req.body);
    res.json({ data: customer });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await customersService.delete(req.params.id);
    res.json({ data: { message: 'Customer deleted' } });
  }),
];
