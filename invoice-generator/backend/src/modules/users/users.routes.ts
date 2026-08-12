import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { listUsers, getUser, updateUser, deleteUser } from './users.controller';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { updateUserSchema, paginationSchema } from './users.dto';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, validateQuery(paginationSchema), listUsers);
router.get('/:id', authenticate, validateParams(idParamSchema), getUser);
router.patch('/:id', authenticate, validateParams(idParamSchema), validateBody(updateUserSchema), updateUser);
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteUser);

export default router;
