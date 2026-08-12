import { purchaseOrderRepository } from './purchase-orders.repository';
import type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput, PurchaseOrderPaginationInput } from './purchase-orders.dto';

export class PurchaseOrderService {
  async list(params: PurchaseOrderPaginationInput) { return purchaseOrderRepository.findMany(params); }
  async getById(id: string) { return purchaseOrderRepository.findById(id); }
  async create(data: CreatePurchaseOrderInput, userId: string) { return purchaseOrderRepository.create(data, userId); }
  async update(id: string, data: UpdatePurchaseOrderInput) { return purchaseOrderRepository.update(id, data); }
  async send(id: string) { return purchaseOrderRepository.send(id); }
  async receive(id: string, userId: string) { return purchaseOrderRepository.receive(id, userId); }
  async delete(id: string) { return purchaseOrderRepository.delete(id); }
}

export const purchaseOrderService = new PurchaseOrderService();
