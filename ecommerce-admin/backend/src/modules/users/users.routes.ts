import { Router } from 'express';
import { list, getById, update, remove } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);
router.use(requireRole(ROLES.SUPER_ADMIN));

router.get('/', ...list);
router.get('/:id', ...getById);
router.patch('/:id', ...update);
router.delete('/:id', ...remove);

export default router;
