import { Router } from 'express';
import { z } from 'zod';
import documentsService from './documents.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createDocumentSchema, listDocumentsSchema } from './documents.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(listDocumentsSchema), asyncHandler(async (req, res) => {
  const result = await documentsService.list(req.query as Record<string, string>);
  res.json(result);
}));

router.get('/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const doc = await documentsService.getById(req.params.id);
  res.json(doc);
}));

router.get('/:id/download', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const doc = await documentsService.getById(req.params.id);
  if (doc.content) {
    const pdf = await documentsService.generatePDF(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);
    res.send(pdf);
  } else {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No downloadable content' } });
  }
}));

router.post('/', authenticate, authorize('HR_ADMIN'), validateBody(createDocumentSchema), asyncHandler(async (req: AuthRequest, res) => {
  const doc = await documentsService.create(req.body, req.user!.userId);
  res.status(201).json(doc);
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  await documentsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
