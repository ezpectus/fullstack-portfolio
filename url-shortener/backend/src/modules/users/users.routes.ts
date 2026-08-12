import { Router } from 'express';
import { z } from 'zod';
import { usersController } from './users.controller';
import { validateBody, validateParams } from '../../middleware/validate';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { updateUserSchema } from './users.dto';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, requireAdmin, usersController.list);
router.get('/:id', authenticate, requireAdmin, validateParams(idParamSchema), usersController.getById);
router.patch('/:id', authenticate, requireAdmin, validateParams(idParamSchema), validateBody(updateUserSchema), usersController.update);
router.delete('/:id', authenticate, requireAdmin, validateParams(idParamSchema), usersController.delete);

export default router;
