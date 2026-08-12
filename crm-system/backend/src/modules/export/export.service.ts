import { customersService } from '../customers/customers.service';
import { dealsService } from '../deals/deals.service';
import type { AuthPayload } from '../../shared/types';

export class ExportService {
  async exportCustomers(user: AuthPayload): Promise<string> {
    return customersService.exportToCSV(user);
  }

  async exportDeals(user: AuthPayload): Promise<string> {
    return dealsService.exportToCSV(user);
  }
}

export const exportService = new ExportService();
