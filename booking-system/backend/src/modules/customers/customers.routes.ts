import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './customers.controller';
import { authenticate } from '../../middleware/auth';
import { validateParams } from '../../middleware/validate';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', ...list);
router.get('/:id', validateParams(idParamSchema), ...getById);
router.post('/', ...create);
router.patch('/:id', validateParams(idParamSchema), ...update);
router.delete('/:id', validateParams(idParamSchema), ...remove);

export default router;
