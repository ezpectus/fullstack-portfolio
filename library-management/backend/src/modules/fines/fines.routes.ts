import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateParams, validateQuery } from '../../middleware/validate';
import { finePaginationSchema, idParamSchema } from './fines.dto';
import { list, getById, pay, waive } from './fines.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateQuery(finePaginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getById);
router.patch('/:id/pay', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), pay);
router.patch('/:id/waive', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), waive);

export default router;
