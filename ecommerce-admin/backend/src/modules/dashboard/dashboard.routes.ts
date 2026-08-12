import { Router } from 'express';
import { overview } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/overview', ...overview);

export default router;
