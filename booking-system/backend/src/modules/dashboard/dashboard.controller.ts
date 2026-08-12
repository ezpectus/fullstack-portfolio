import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const getOverview = [
  asyncHandler(async (_req: Request, res: Response) => {
    const overview = await dashboardService.getOverview();
    res.json({ data: overview });
  }),
];

export const getBookingsByDay = [
  asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getBookingsByDay(req.query.startDate as string, req.query.endDate as string);
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
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await dashboardService.getUpcomingBookings(limit);
    res.json({ data });
  }),
];
