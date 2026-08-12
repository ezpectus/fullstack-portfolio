import { Router } from 'express';
import { revenue, orders, topProducts, topCategories, summary } from './analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/revenue', ...revenue);
router.get('/orders', ...orders);
router.get('/top-products', ...topProducts);
router.get('/top-categories', ...topCategories);
router.get('/summary', ...summary);

export default router;
