import { Router } from 'express';
import { z } from 'zod';
import reportsService from './reports.service';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams } from '../../middleware/validate';
import { NotFoundError } from '../../shared/errors';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/headcount', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const report = await reportsService.getHeadcountReport();
  res.json(report);
}));

router.get('/payroll', authenticate, authorize('HR_ADMIN'), asyncHandler(async (req, res) => {
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const report = await reportsService.getPayrollReport(month, year);
  res.json(report);
}));

router.get('/leave', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const report = await reportsService.getLeaveReport(year);
  res.json(report);
}));

router.get('/employee/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const report = await reportsService.getEmployeeReport(req.params.id);
  if (!report) throw new NotFoundError('Employee');
  res.json(report);
}));

router.get('/export', authenticate, authorize('HR_ADMIN'), asyncHandler(async (req, res) => {
  const reportType = (req.query.type as string) || 'headcount';
  const csv = await reportsService.exportCSV(reportType);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="report.csv"`);
  res.send(csv);
}));

export default router;
