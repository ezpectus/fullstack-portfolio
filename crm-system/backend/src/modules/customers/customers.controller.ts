import { Request, Response } from 'express';
import { customersService } from './customers.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { MAX_PAGE_SIZE } from '../../shared/constants';

export class CustomersController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await customersService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: Math.min(MAX_PAGE_SIZE, parseInt(req.query.limit as string) || 20),
      search: req.query.search as string | undefined,
      status: req.query.status as string | undefined,
      tags: req.query.tags as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      user: req.user!,
    });
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.getById(req.params.id, req.user!);
    res.json({ data: customer });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.create(req.body, req.user!);
    res.status(201).json({ data: customer, message: 'Customer created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.update(req.params.id, req.body, req.user!);
    res.json({ data: customer, message: 'Customer updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await customersService.delete(req.params.id, req.user!);
    res.status(204).send();
  });

  timeline = asyncHandler(async (req: Request, res: Response) => {
    const timeline = await customersService.getTimeline(req.params.id, req.user!);
    res.json({ data: timeline });
  });
}

export const customersController = new CustomersController();
