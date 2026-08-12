import { Request, Response } from 'express';
import { promoCodesService } from './promo-codes.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createPromoSchema, updatePromoSchema, paginationSchema } from './promo-codes.dto';
import { asyncHandler } from '../../middleware/asyncHandler';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query);
    const result = await promoCodesService.list(query);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const getById = [
  asyncHandler(async (req: Request, res: Response) => {
    const code = await promoCodesService.getById(req.params.id);
    res.json({ data: code });
  }),
];

export const create = [
  validateBody(createPromoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const code = await promoCodesService.create(req.body);
    res.status(201).json({ data: code });
  }),
];

export const update = [
  validateBody(updatePromoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const code = await promoCodesService.update(req.params.id, req.body);
    res.json({ data: code });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await promoCodesService.delete(req.params.id);
    res.status(204).json({ data: { message: 'Promo code deleted' } });
  }),
];
