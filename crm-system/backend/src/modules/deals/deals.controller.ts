import { Request, Response } from 'express';
import { dealsService } from './deals.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { MAX_PAGE_SIZE } from '../../shared/constants';

export class DealsController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await dealsService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: Math.min(MAX_PAGE_SIZE, parseInt(req.query.limit as string) || 20),
      search: req.query.search as string | undefined,
      stage: req.query.stage as string | undefined,
      customerId: req.query.customerId as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      user: req.user!,
    });
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const deal = await dealsService.getById(req.params.id, req.user!);
    res.json({ data: deal });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const deal = await dealsService.create(req.body, req.user!);
    res.status(201).json({ data: deal, message: 'Deal created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const deal = await dealsService.update(req.params.id, req.body, req.user!);
    res.json({ data: deal, message: 'Deal updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await dealsService.delete(req.params.id, req.user!);
    res.status(204).send();
  });

  kanban = asyncHandler(async (req: Request, res: Response) => {
    const kanban = await dealsService.getKanban(req.user!);
    res.json({ data: kanban });
  });
}

export const dealsController = new DealsController();
