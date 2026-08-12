import { Router } from 'express';
import { overview } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);
router.get('/overview', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...overview);

export default router;
