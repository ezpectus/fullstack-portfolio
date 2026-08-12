import { Request, Response } from 'express';
import { ordersService } from './orders.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema, paginationSchema } from './orders.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AuthRequest } from '../../middleware/auth';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query);
    const result = await ordersService.list(query);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const order = await ordersService.getById(req.params.id);
    res.json({ data: order });
  }),
];

export const create = [
  validateBody(createOrderSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await ordersService.create(req.body);
    res.status(201).json({ data: order });
  }),
];

export const updateStatus = [
  validateBody(updateOrderStatusSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await ordersService.updateStatus(req.params.id, req.body, req.user!.id);
    res.json({ data: order });
  }),
];
