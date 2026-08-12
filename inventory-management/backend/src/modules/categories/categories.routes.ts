import { Router } from 'express';
import { z } from 'zod';
import { categoryController } from './categories.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, ...categoryController.list);
router.get('/:id', authenticate, validateParams(idParamSchema), ...categoryController.getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...categoryController.create);
router.patch('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...categoryController.update);
router.delete('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...categoryController.delete);

export default router;
