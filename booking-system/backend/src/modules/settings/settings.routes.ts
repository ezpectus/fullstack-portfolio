import { Router } from 'express';
import { getAll, getByKey, update, bulkUpdate, remove } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/', ...getAll);
router.get('/:key', ...getByKey);
router.put('/', requireRole(ROLES.ADMIN), ...update);
router.put('/bulk', requireRole(ROLES.ADMIN), ...bulkUpdate);
router.delete('/:key', requireRole(ROLES.ADMIN), ...remove);

export default router;
