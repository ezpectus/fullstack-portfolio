import { Router } from 'express';
import { z } from 'zod';
import { purchaseOrderController } from './purchase-orders.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), ...purchaseOrderController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), validateParams(idParamSchema), ...purchaseOrderController.getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), ...purchaseOrderController.create);
router.patch('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...purchaseOrderController.update);
router.patch('/:id/send', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...purchaseOrderController.send);
router.patch('/:id/receive', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...purchaseOrderController.receive);
router.delete('/:id', authenticate, validateParams(idParamSchema), requireRole(ROLES.ADMIN, ROLES.MANAGER), ...purchaseOrderController.delete);

export default router;
