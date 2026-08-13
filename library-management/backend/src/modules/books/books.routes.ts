import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { createBookSchema, updateBookSchema, paginationSchema, idParamSchema } from './books.dto';
import { list, getById, create, update, remove } from './books.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER), validateQuery(paginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER), validateParams(idParamSchema), getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateBody(createBookSchema), create);
router.patch('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), validateBody(updateBookSchema), update);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), validateParams(idParamSchema), remove);

export default router;
