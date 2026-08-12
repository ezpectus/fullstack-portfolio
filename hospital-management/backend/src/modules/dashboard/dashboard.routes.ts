import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import dashboardService from './dashboard.service';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(async (_req: AuthRequest, res: Response) => {
  const overview = await dashboardService.getOverview();
  res.json(overview);
}));

export default router;
