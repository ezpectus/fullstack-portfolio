import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { reportsService } from './reports.service';

export const memberActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  const result = await reportsService.memberActivity(startDate, endDate);
  res.json(result);
});

export const popularGenres = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const result = await reportsService.popularGenres();
  res.json(result);
});

export const lostDamaged = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const result = await reportsService.lostDamagedBooks();
  res.json(result);
});

export const exportCsv = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const csv = await reportsService.exportCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=loans-report.csv');
  res.send(csv);
});
