import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, updateStatus, remove } from './bookings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...list);
router.get('/:id', validateParams(idParamSchema), ...getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...create);
router.patch('/:id/status', validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...updateStatus);
router.delete('/:id', validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...remove);

export default router;
