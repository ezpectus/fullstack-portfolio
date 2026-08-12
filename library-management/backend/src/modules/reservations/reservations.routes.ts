import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { createReservationSchema, fulfillReservationSchema, reservationPaginationSchema, idParamSchema } from './reservations.dto';
import { list, getById, create, cancel, fulfill } from './reservations.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateQuery(reservationPaginationSchema), list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), getById);
router.post('/', authenticate, validateBody(createReservationSchema), create);
router.patch('/:id/cancel', authenticate, validateParams(idParamSchema), cancel);
router.patch('/:id/fulfill', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), validateParams(idParamSchema), validateBody(fulfillReservationSchema), fulfill);

export default router;
