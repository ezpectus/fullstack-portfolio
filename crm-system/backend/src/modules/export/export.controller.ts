import { Request, Response } from 'express';
import { exportService } from './export.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export class ExportController {
  exportCustomers = asyncHandler(async (req: Request, res: Response) => {
    const csv = await exportService.exportCustomers(req.user!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    res.send(csv);
  });

  exportDeals = asyncHandler(async (req: Request, res: Response) => {
    const csv = await exportService.exportDeals(req.user!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="deals.csv"');
    res.send(csv);
  });
}

export const exportController = new ExportController();
