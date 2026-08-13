import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createTemplateSchema, updateTemplateSchema, templatePaginationSchema } from './templates.dto';
import { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate } from './templates.controller';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.get('/', requireRole('OWNER', 'ACCOUNTANT', 'VIEWER'), validateQuery(templatePaginationSchema), listTemplates);
router.get('/:id', validateParams(idParamSchema), getTemplate);
router.post('/', requireRole('OWNER', 'ACCOUNTANT'), validateBody(createTemplateSchema), createTemplate);
router.patch('/:id', requireRole('OWNER', 'ACCOUNTANT'), validateParams(idParamSchema), validateBody(updateTemplateSchema), updateTemplate);
router.delete('/:id', requireRole('OWNER'), validateParams(idParamSchema), deleteTemplate);

export { router as templatesRoutes };
