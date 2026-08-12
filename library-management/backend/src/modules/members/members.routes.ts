import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { updateMemberSchema, memberPaginationSchema, idParamSchema } from './members.dto';
import { list, getById, update, getLoans, getFines } from './members.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateQuery(memberPaginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getById);
router.patch('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), validateBody(updateMemberSchema), update);
router.get('/:id/loans', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getLoans);
router.get('/:id/fines', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getFines);

export default router;
