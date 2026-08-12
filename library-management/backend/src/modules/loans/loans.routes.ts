import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { createLoanSchema, loanPaginationSchema, idParamSchema } from './loans.dto';
import { list, listMy, getById, create, returnBook, renew } from './loans.controller';

const router = Router();

router.get('/my', authenticate, validateQuery(loanPaginationSchema), listMy);
router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateQuery(loanPaginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getById);
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateBody(createLoanSchema), create);
router.patch('/:id/return', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), returnBook);
router.patch('/:id/renew', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), renew);

export default router;
