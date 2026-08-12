import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export class DashboardController {
  metrics = [asyncHandler(async (_req: Request, res: Response) => {
    const result = await dashboardService.getMetrics();
    res.json(result);
  })];

  trends = [asyncHandler(async (_req: Request, res: Response) => {
    const result = await dashboardService.getInventoryTrends();
    res.json(result);
  })];
}

export const dashboardController = new DashboardController();
