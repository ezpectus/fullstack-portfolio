import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { invoicesService } from './invoices.service';
import { InvoiceStatus } from '@prisma/client';

export const listInvoices = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;
  const status = req.query.status as InvoiceStatus | undefined;
  const clientId = req.query.clientId as string | undefined;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) || 'desc';
  const result = await invoicesService.list(req.user!.id, page, limit, search, status, clientId, sortBy, sortOrder);
  res.json(result);
});

export const getInvoice = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await invoicesService.getById(req.user!.id, req.params.id);
  res.json(invoice);
});

export const createInvoice = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await invoicesService.create(req.user!.id, req.body);
  res.status(201).json(invoice);
});

export const updateInvoice = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await invoicesService.update(req.user!.id, req.params.id, req.body);
  res.json(invoice);
});

export const updateInvoiceStatus = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await invoicesService.updateStatus(req.user!.id, req.params.id, req.body.status as InvoiceStatus);
  res.json(invoice);
});

export const deleteInvoice = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await invoicesService.delete(req.user!.id, req.params.id);
  res.json({ message: 'Invoice deleted' });
});
