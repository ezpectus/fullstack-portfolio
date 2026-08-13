import { Router } from 'express';
import { z } from 'zod';
import { warehouseController } from './warehouses.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...warehouseController.list);
router.get('/:id', authenticate, validateParams(idParamSchema), ...warehouseController.getById);
router.get('/:id/stock', authenticate, validateParams(idParamSchema), ...warehouseController.getStock);
router.post('/', authenticate, requireRole(ROLES.ADMIN), ...warehouseController.create);
router.patch('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...warehouseController.update);
router.delete('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN), ...warehouseController.delete);

export default router;
