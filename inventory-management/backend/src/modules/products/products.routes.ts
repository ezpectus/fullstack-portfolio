import { Router } from 'express';
import { z } from 'zod';
import { productController } from './products.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...productController.list);
router.get('/:id', authenticate, validateParams(idParamSchema), ...productController.getById);
router.get('/:id/stock', authenticate, validateParams(idParamSchema), ...productController.getStock);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...productController.create);
router.patch('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...productController.update);
router.delete('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...productController.delete);

export default router;
