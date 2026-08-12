import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { exportProducts, exportStockMovements, exportPurchaseOrders } from './export.controller';
import { ROLES } from '../../shared/constants';

const router = Router();

router.get('/products', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), exportProducts);
router.get('/stock', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), exportStockMovements);
router.get('/purchase-orders', authenticate, requireRole(ROLES.ADMIN, ROLES.MANAGER), exportPurchaseOrders);

export default router;
