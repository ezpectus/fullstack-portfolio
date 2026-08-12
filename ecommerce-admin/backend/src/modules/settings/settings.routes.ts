import { Router } from 'express';
import { list, getByKey, upsert, bulkUpsert } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/', ...list);
router.get('/:key', ...getByKey);
router.put('/', requireRole(ROLES.SUPER_ADMIN), ...upsert);
router.put('/bulk', requireRole(ROLES.SUPER_ADMIN), ...bulkUpsert);

export default router;
