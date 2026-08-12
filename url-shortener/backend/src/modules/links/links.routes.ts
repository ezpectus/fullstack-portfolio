import { Router } from 'express';
import { linksController } from './links.controller';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { createLinkSchema, updateLinkSchema, linkQuerySchema, bulkCreateSchema } from './links.dto';
import { z } from 'zod';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', validateQuery(linkQuerySchema), linksController.list);
router.get('/:id', validateParams(idParamSchema), linksController.getById);
router.post('/', validateBody(createLinkSchema), linksController.create);
router.post('/bulk', validateBody(bulkCreateSchema), linksController.bulkCreate);
router.put('/:id', validateParams(idParamSchema), validateBody(updateLinkSchema), linksController.update);
router.delete('/:id', validateParams(idParamSchema), linksController.delete);

export default router;
