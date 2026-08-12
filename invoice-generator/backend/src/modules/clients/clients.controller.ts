import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { clientsService } from './clients.service';

export const listClients = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) || 'desc';
  const result = await clientsService.list(req.user!.id, page, limit, search, sortBy, sortOrder);
  res.json(result);
});

export const getClient = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const client = await clientsService.getById(req.user!.id, req.params.id);
  res.json(client);
});

export const getClientBalance = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const balance = await clientsService.getBalance(req.user!.id, req.params.id);
  res.json(balance);
});

export const createClient = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const client = await clientsService.create(req.user!.id, req.body);
  res.status(201).json(client);
});

export const updateClient = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const client = await clientsService.update(req.user!.id, req.params.id, req.body);
  res.json(client);
});

export const deleteClient = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await clientsService.delete(req.user!.id, req.params.id);
  res.json({ message: 'Client deleted' });
});
