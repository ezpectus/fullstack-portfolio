import { Router } from 'express';
import { z } from 'zod';
import { list, getById, update, remove } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);
router.use(requireRole(ROLES.ADMIN));

router.get('/', ...list);
router.get('/:id', validateParams(idParamSchema), ...getById);
router.patch('/:id', validateParams(idParamSchema), ...update);
router.delete('/:id', validateParams(idParamSchema), ...remove);

export default router;
