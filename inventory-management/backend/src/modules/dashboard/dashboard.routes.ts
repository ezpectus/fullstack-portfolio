import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.get('/metrics', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...dashboardController.metrics);
router.get('/trends', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...dashboardController.trends);

export default router;
