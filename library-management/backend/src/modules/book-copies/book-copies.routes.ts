import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { createCopySchema, updateCopySchema, copyPaginationSchema, idParamSchema } from './book-copies.dto';
import { list, getById, create, update, remove } from './book-copies.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER), validateQuery(copyPaginationSchema), list);
router.get('/:id', authenticate, validateParams(idParamSchema), getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateBody(createCopySchema), create);
router.patch('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), validateBody(updateCopySchema), update);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), remove);

export default router;
