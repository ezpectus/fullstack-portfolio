import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/metrics', authenticate, ...dashboardController.metrics);
router.get('/trends', authenticate, ...dashboardController.trends);

export default router;
