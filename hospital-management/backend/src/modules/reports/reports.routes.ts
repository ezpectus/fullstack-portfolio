import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import reportsService from './reports.service';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'DOCTOR'));

router.get('/appointments', asyncHandler(async (req: AuthRequest, res: Response) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
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

router.get('/revenue', authorize('ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const report = await reportsService.getRevenueReport(startDate, endDate);
  res.json(report);
}));

export default router;
