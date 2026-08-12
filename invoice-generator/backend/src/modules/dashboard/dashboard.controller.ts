import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { dashboardService } from './dashboard.service';

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const stats = await dashboardService.getStats(req.user!.id);
  res.json(stats);
});
