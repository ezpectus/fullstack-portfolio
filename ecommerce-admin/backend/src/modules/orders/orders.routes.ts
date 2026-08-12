import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, updateStatus } from './orders.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', ...list);
router.get('/:id', validateParams(idParamSchema), ...getById);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...create);
router.patch('/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), validateParams(idParamSchema), ...updateStatus);

export default router;
