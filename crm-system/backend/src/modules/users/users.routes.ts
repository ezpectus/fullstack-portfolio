import { Router } from 'express';
import { usersController } from './users.controller';
import { validateBody, validateParams } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';
import { updateUserSchema } from './users.dto';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', requireAdmin, usersController.list);
router.get('/:id', requireAdmin, validateParams(idParamSchema), usersController.getById);
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateBody(updateUserSchema), usersController.update);
router.delete('/:id', requireAdmin, validateParams(idParamSchema), usersController.delete);

export default router;
