import { Router } from 'express';
import { z } from 'zod';
import { getAll, getByKey, update, bulkUpdate, remove } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();
const keyParamSchema = z.object({ key: z.string() });

router.use(authenticate);

router.get('/', requireRole(ROLES.ADMIN), ...getAll);
router.get('/:key', requireRole(ROLES.ADMIN), validateParams(keyParamSchema), ...getByKey);
router.put('/', requireRole(ROLES.ADMIN), ...update);
router.put('/bulk', requireRole(ROLES.ADMIN), ...bulkUpdate);
router.delete('/:key', requireRole(ROLES.ADMIN), validateParams(keyParamSchema), ...remove);

export default router;
