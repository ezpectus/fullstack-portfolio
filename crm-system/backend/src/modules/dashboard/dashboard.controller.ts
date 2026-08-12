import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export class DashboardController {
  stats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await dashboardService.getStats(req.user!);
    res.json({ data: stats });
  });

  dealsByStage = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getDealsByStage(req.user!);
    res.json({ data });
  });

  newCustomers = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const data = await dashboardService.getNewCustomers(req.user!, days);
    res.json({ data });
  });

  recentActivity = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await dashboardService.getRecentActivity(req.user!, limit);
    res.json({ data });
  });
}

export const dashboardController = new DashboardController();
