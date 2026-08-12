import { Router } from 'express';
import { stockMovementController } from './stock-movements.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';

const router = Router();

router.get('/', authenticate, ...stockMovementController.list);
router.post('/', authenticate, ...stockMovementController.create);

export default router;
