import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import dashboardService from './dashboard.service';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), asyncHandler(async (_req: AuthRequest, res: Response) => {
  const overview = await dashboardService.getOverview();
  res.json(overview);
}));

export default router;
