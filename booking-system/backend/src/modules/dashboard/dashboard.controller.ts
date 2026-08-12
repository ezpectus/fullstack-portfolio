import { Request, Response } from 'express';
import { z } from 'zod';
import { dashboardService } from './dashboard.service';
import { validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const limitSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const getOverview = [
  asyncHandler(async (_req: Request, res: Response) => {
    const overview = await dashboardService.getOverview();
    res.json({ data: overview });
  }),
];

export const getBookingsByDay = [
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = dateRangeSchema.parse(req.query);
    const data = await dashboardService.getBookingsByDay(query.startDate, query.endDate);
    res.json({ data });
  }),
];

export const getTopServices = [
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.getTopServices();
    res.json({ data });
  }),
];

export const getTopProviders = [
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.getTopProviders();
    res.json({ data });
  }),
];

export const getUpcomingBookings = [
  validateQuery(limitSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = limitSchema.parse(req.query);
    const data = await dashboardService.getUpcomingBookings(query.limit || 10);
    res.json({ data });
  }),
];
