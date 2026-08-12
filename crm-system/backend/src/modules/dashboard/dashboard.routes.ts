import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', dashboardController.stats);
router.get('/deals-by-stage', dashboardController.dealsByStage);
router.get('/new-customers', dashboardController.newCustomers);
router.get('/recent-activity', dashboardController.recentActivity);

export default router;
