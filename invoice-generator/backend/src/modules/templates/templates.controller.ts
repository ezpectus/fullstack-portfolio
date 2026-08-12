import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { templatesService } from './templates.service';

export const listTemplates = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;
  const result = await templatesService.list(req.user!.id, page, limit, search);
  res.json(result);
});

export const getTemplate = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const template = await templatesService.getById(req.user!.id, req.params.id);
  res.json(template);
});

export const createTemplate = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const template = await templatesService.create(req.user!.id, req.body);
  res.status(201).json(template);
});

export const updateTemplate = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const template = await templatesService.update(req.user!.id, req.params.id, req.body);
  res.json(template);
});

export const deleteTemplate = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await templatesService.delete(req.user!.id, req.params.id);
  res.json({ message: 'Template deleted' });
});
