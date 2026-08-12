import { Router } from 'express';
import { z } from 'zod';
import { list, getByKey, upsert, bulkUpsert } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();
const keyParamSchema = z.object({ key: z.string() });

router.use(authenticate);

router.get('/', requireRole(ROLES.SUPER_ADMIN), ...list);
router.get('/:key', requireRole(ROLES.SUPER_ADMIN), validateParams(keyParamSchema), ...getByKey);
router.put('/', requireRole(ROLES.SUPER_ADMIN), ...upsert);
router.put('/bulk', requireRole(ROLES.SUPER_ADMIN), ...bulkUpsert);

export default router;
