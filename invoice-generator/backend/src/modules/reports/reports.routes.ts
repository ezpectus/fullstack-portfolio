import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { getRevenueReport, getOverdueReport, getTopClients, exportRevenueCsv } from './reports.controller';

const router = Router();

router.use(authenticate);

router.get('/revenue', requireRole('OWNER', 'ACCOUNTANT'), getRevenueReport);
router.get('/overdue', requireRole('OWNER', 'ACCOUNTANT'), getOverdueReport);
router.get('/top-clients', requireRole('OWNER', 'ACCOUNTANT'), getTopClients);
router.get('/revenue/csv', requireRole('OWNER', 'ACCOUNTANT'), exportRevenueCsv);

export default router;
