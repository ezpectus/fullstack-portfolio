import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireManager } from '../../middleware/rbac';
import { exportController } from './export.controller';

const router = Router();

router.use(authenticate);

router.get('/customers', requireManager, exportController.exportCustomers);
router.get('/deals', requireManager, exportController.exportDeals);

export default router;
