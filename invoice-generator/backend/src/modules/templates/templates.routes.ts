import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createTemplateSchema, updateTemplateSchema, templatePaginationSchema } from './templates.dto';
import { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate } from './templates.controller';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(templatePaginationSchema), listTemplates);
router.get('/:id', validateParams(idParamSchema), getTemplate);
router.post('/', validateBody(createTemplateSchema), createTemplate);
router.patch('/:id', validateParams(idParamSchema), validateBody(updateTemplateSchema), updateTemplate);
router.delete('/:id', validateParams(idParamSchema), deleteTemplate);

export { router as templatesRoutes };
