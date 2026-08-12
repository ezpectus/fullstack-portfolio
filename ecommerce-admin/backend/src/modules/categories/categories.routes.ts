import { Router } from 'express';
import { list, tree, getById, create, update, remove } from './categories.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/', ...list);
router.get('/tree', ...tree);
router.get('/:id', ...getById);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...create);
router.patch('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...update);
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.MANAGER), ...remove);

export default router;
