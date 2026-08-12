import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const revenue = [
  asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getRevenueChart(req.query.startDate as string, req.query.endDate as string);
    res.json({ data });
  }),
];

export const orders = [
  asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getOrdersChart(req.query.startDate as string, req.query.endDate as string);
    res.json({ data });
  }),
];

export const topProducts = [
  asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getTopProducts(parseInt(req.query.limit as string) || 10);
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
  asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getSummary(req.query.startDate as string, req.query.endDate as string);
    res.json({ data });
  }),
];
