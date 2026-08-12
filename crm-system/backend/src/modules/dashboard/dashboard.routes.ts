import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/stats', requireRole(ROLES.ADMIN, ROLES.MANAGER), dashboardController.stats);
router.get('/deals-by-stage', requireRole(ROLES.ADMIN, ROLES.MANAGER), dashboardController.dealsByStage);
router.get('/new-customers', requireRole(ROLES.ADMIN, ROLES.MANAGER), dashboardController.newCustomers);
router.get('/recent-activity', requireRole(ROLES.ADMIN, ROLES.MANAGER), dashboardController.recentActivity);

export default router;
