import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getDashboardStats } from './dashboard.controller';

const router = Router();

router.use(authenticate);

router.get('/', getDashboardStats);

export default router;
