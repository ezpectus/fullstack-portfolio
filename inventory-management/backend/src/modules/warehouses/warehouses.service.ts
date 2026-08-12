import { warehouseRepository } from './warehouses.repository';
import type { CreateWarehouseInput, UpdateWarehouseInput } from './warehouses.dto';

export class WarehouseService {
  async list() { return warehouseRepository.findAll(); }
  async getById(id: string) { return warehouseRepository.findById(id); }
  async create(data: CreateWarehouseInput) { return warehouseRepository.create(data); }
  async update(id: string, data: UpdateWarehouseInput) { return warehouseRepository.update(id, data); }
  async delete(id: string) { return warehouseRepository.delete(id); }
  async getStockLevels(id: string) { return warehouseRepository.getStockLevels(id); }
}

export const warehouseService = new WarehouseService();
