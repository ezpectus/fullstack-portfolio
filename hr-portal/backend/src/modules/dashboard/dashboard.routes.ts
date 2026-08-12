import { Router } from 'express';
import dashboardService from './dashboard.service';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();

router.get('/stats', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getStats();
  res.json(stats);
}));

router.get('/employee-growth', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const data = await dashboardService.getEmployeeGrowth();
  res.json(data);
}));

router.get('/department-distribution', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const data = await dashboardService.getDepartmentDistribution();
  res.json(data);
}));

router.get('/leave-trends', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const data = await dashboardService.getLeaveTrends();
  res.json(data);
}));

export default router;
