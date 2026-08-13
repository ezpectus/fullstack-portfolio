import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './services.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: List services
 *     tags: [Services]
 */
router.get('/', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...list);
router.get('/:id', requireRole(ROLES.ADMIN, ROLES.PROVIDER), validateParams(idParamSchema), ...getById);
router.post('/', requireRole(ROLES.ADMIN), ...create);
router.patch('/:id', validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...update);
router.delete('/:id', validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...remove);

export default router;
