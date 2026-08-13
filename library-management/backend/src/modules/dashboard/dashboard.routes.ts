import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { getStats } from './dashboard.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), getStats);

export default router;
