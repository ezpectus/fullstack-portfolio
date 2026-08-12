import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getRevenueReport, getOverdueReport, getTopClients, exportRevenueCsv } from './reports.controller';

const router = Router();

router.use(authenticate);

router.get('/revenue', getRevenueReport);
router.get('/overdue', getOverdueReport);
router.get('/top-clients', getTopClients);
router.get('/revenue/csv', exportRevenueCsv);

export default router;
