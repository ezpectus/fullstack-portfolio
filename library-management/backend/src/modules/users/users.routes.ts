import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { updateUserSchema, paginationSchema, idParamSchema } from './users.dto';
import { list, getById, update, remove } from './users.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateQuery(paginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getById);
router.patch('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), validateBody(updateUserSchema), update);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), remove);

export default router;
