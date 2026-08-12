import { Router } from 'express';
import { list, send } from './notifications.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/', ...list);
router.post('/send', requireRole(ROLES.ADMIN), ...send);

export default router;
