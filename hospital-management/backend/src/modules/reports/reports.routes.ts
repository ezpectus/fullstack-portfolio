import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateQuery } from '../../middleware/validate';
import reportsService from './reports.service';

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'DOCTOR'));

router.get('/appointments', validateQuery(dateRangeSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = dateRangeSchema.parse(req.query);
  const startDate = query.startDate ? new Date(query.startDate) : undefined;
  const endDate = query.endDate ? new Date(query.endDate) : undefined;
  const report = await reportsService.getAppointmentReport(startDate, endDate);
  res.json(report);
}));

router.get('/patients', authorize('ADMIN'), asyncHandler(async (_req: AuthRequest, res: Response) => {
  const report = await reportsService.getPatientReport();
  res.json(report);
}));

router.get('/doctors', authorize('ADMIN'), asyncHandler(async (_req: AuthRequest, res: Response) => {
  const report = await reportsService.getDoctorReport();
  res.json(report);
}));

router.get('/revenue', authorize('ADMIN'), validateQuery(dateRangeSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = dateRangeSchema.parse(req.query);
  const startDate = query.startDate ? new Date(query.startDate) : undefined;
  const endDate = query.endDate ? new Date(query.endDate) : undefined;
  const report = await reportsService.getRevenueReport(startDate, endDate);
  res.json(report);
}));

export default router;
