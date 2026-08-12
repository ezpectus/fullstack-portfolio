import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { reportsService } from './reports.service';

export const getRevenueReport = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);
  const report = await reportsService.getRevenueReport(req.user!.id, startDate, endDate);
  res.json(report);
});

export const getOverdueReport = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await reportsService.getOverdueReport(req.user!.id);
  res.json(report);
});

export const getTopClients = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);
  const report = await reportsService.getTopClients(req.user!.id, startDate, endDate);
  res.json(report);
});

export const exportRevenueCsv = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);
  const csv = await reportsService.exportRevenueCsv(req.user!.id, startDate, endDate);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="revenue-report.csv"');
  res.send(csv);
});
