import { Router } from 'express';
import { dealsController } from './deals.controller';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';
import { createDealSchema, updateDealSchema, dealQuerySchema } from './deals.dto';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/kanban', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), dealsController.kanban);
router.get('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateQuery(dealQuerySchema), dealsController.list);
router.get('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), dealsController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateBody(createDealSchema), dealsController.create);
router.put('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), validateBody(updateDealSchema), dealsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), dealsController.delete);

export default router;
