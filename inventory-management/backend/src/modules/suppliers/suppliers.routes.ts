import { Router } from 'express';
import { z } from 'zod';
import { supplierController } from './suppliers.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...supplierController.list);
router.get('/:id', authenticate, validateParams(idParamSchema), ...supplierController.getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...supplierController.create);
router.patch('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...supplierController.update);
router.delete('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...supplierController.delete);

export default router;
