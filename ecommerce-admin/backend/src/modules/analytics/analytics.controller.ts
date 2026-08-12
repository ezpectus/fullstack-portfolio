import { Request, Response } from 'express';
import { z } from 'zod';
import { analyticsService } from './analytics.service';
import { validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const limitSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const revenue = [
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = dateRangeSchema.parse(req.query);
    const data = await analyticsService.getRevenueChart(query.startDate, query.endDate);
    res.json({ data });
  }),
];

export const orders = [
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = dateRangeSchema.parse(req.query);
    const data = await analyticsService.getOrdersChart(query.startDate, query.endDate);
    res.json({ data });
  }),
];

export const topProducts = [
  validateQuery(limitSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = limitSchema.parse(req.query);
    const data = await analyticsService.getTopProducts(query.limit || 10);
    res.json({ data });
  }),
];

export const topCategories = [
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await analyticsService.getTopCategories();
    res.json({ data });
  }),
];

export const summary = [
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = dateRangeSchema.parse(req.query);
    const data = await analyticsService.getSummary(query.startDate, query.endDate);
    res.json({ data });
  }),
];
