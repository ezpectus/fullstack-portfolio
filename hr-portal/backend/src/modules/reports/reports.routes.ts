import { Router } from 'express';
import { z } from 'zod';
import reportsService from './reports.service';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams, validateQuery } from '../../middleware/validate';
import { NotFoundError } from '../../shared/errors';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });
const monthYearSchema = z.object({
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().optional(),
});
const yearSchema = z.object({ year: z.coerce.number().optional() });
const exportSchema = z.object({ type: z.enum(['headcount', 'payroll', 'leave']).default('headcount') });

router.get('/headcount', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const report = await reportsService.getHeadcountReport();
  res.json(report);
}));

router.get('/payroll', authenticate, authorize('HR_ADMIN'), validateQuery(monthYearSchema), asyncHandler(async (req, res) => {
  const query = monthYearSchema.parse(req.query);
  const report = await reportsService.getPayrollReport(query.month, query.year);
  res.json(report);
}));

router.get('/leave', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(yearSchema), asyncHandler(async (req, res) => {
  const query = yearSchema.parse(req.query);
  const report = await reportsService.getLeaveReport(query.year);
  res.json(report);
}));

router.get('/employee/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const report = await reportsService.getEmployeeReport(req.params.id);
  if (!report) throw new NotFoundError('Employee');
  res.json(report);
}));

router.get('/export', authenticate, authorize('HR_ADMIN'), validateQuery(exportSchema), asyncHandler(async (req, res) => {
  const query = exportSchema.parse(req.query);
  const csv = await reportsService.exportCSV(query.type);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="report.csv"`);
  res.send(csv);
}));

export default router;
