import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { dashboardService } from './dashboard.service';

export const getStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const stats = await dashboardService.getStats();
  res.json(stats);
});
