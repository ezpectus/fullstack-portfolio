import { Router } from 'express';
import { z } from 'zod';
import { userController } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireRole(ROLES.ADMIN), ...userController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), ...userController.getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN), ...userController.create);
router.patch('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), ...userController.update);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), ...userController.delete);

export default router;
