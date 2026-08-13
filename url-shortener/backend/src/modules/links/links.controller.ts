import { Request, Response } from 'express';
import { linksService } from './links.service';
import { AuthRequest } from '../../middleware/auth';
import { env } from '../../config/env';
import { asyncHandler } from '../../middleware/asyncHandler';
import { linkQuerySchema } from './links.dto';

export const linksController = {
  list: asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = linkQuerySchema.parse(req.query);
    const result = await linksService.list(req.user!.id, query);
    res.json(result);
  }),

  getById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const link = await linksService.getById(req.user!.id, req.params.id);
    res.json({ ...link, shortUrl: `${env.shortDomain}/${link.shortCode}` });
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const link = await linksService.create(req.user!.id, req.body);
    res.status(201).json({ ...link, shortUrl: `${env.shortDomain}/${link.shortCode}` });
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const link = await linksService.update(req.user!.id, req.params.id, req.body);
    res.json({ ...link, shortUrl: `${env.shortDomain}/${link.shortCode}` });
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await linksService.delete(req.user!.id, req.params.id);
    res.json(result);
  }),

  bulkCreate: asyncHandler(async (req: AuthRequest, res: Response) => {
    const results = await linksService.bulkCreate(req.user!.id, req.body.urls);
    res.status(201).json({ results });
  }),
};
