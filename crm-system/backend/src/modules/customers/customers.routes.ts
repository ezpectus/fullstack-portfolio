import { Router } from 'express';
import { customersController } from './customers.controller';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';
import { createCustomerSchema, updateCustomerSchema, customerQuerySchema } from './customers.dto';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateQuery(customerQuerySchema), customersController.list);
router.get('/:id', validateParams(idParamSchema), customersController.getById);
router.get('/:id/timeline', validateParams(idParamSchema), customersController.timeline);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateBody(createCustomerSchema), customersController.create);
router.put('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), validateBody(updateCustomerSchema), customersController.update);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), customersController.delete);

export default router;
