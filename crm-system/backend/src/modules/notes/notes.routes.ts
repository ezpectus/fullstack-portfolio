import { Router } from 'express';
import { notesController } from './notes.controller';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';
import { createNoteSchema, updateNoteSchema, noteQuerySchema } from './notes.dto';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateQuery(noteQuerySchema), notesController.list);
router.get('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), notesController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateBody(createNoteSchema), notesController.create);
router.put('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), validateBody(updateNoteSchema), notesController.update);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), notesController.delete);
router.patch('/:id/pin', requireRole(ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES_REP), validateParams(idParamSchema), notesController.togglePin);

export default router;
