import { Router } from 'express';
import { revenue, orders, topProducts, topCategories, summary } from './analytics.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/revenue', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...revenue);
router.get('/orders', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...orders);
router.get('/top-products', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...topProducts);
router.get('/top-categories', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...topCategories);
router.get('/summary', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...summary);

export default router;
