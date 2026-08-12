import { Request, Response } from 'express';
import { exportService } from './export.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const exportProducts = asyncHandler(async (_req: Request, res: Response) => {
  const csv = await exportService.exportProductsCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
  res.send(csv);
});

export const exportStockMovements = asyncHandler(async (_req: Request, res: Response) => {
  const csv = await exportService.exportStockMovementsCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=stock-movements.csv');
  res.send(csv);
});

export const exportPurchaseOrders = asyncHandler(async (_req: Request, res: Response) => {
  const csv = await exportService.exportPurchaseOrdersCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=purchase-orders.csv');
  res.send(csv);
});
