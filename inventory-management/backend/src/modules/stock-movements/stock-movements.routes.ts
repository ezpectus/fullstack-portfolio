import { Router } from 'express';
import { stockMovementController } from './stock-movements.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...stockMovementController.list);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...stockMovementController.create);

export default router;
