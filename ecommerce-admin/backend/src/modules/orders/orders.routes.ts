import { Router } from 'express';
import { list, getById, create, updateStatus } from './orders.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/', ...list);
router.get('/:id', ...getById);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...create);
router.patch('/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), ...updateStatus);

export default router;
