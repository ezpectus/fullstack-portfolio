import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const overview = [
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.getOverview();
    res.json({ data });
  }),
];
