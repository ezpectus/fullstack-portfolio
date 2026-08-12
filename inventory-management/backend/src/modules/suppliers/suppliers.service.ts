import { supplierRepository } from './suppliers.repository';
import type { CreateSupplierInput, UpdateSupplierInput } from './suppliers.dto';

export class SupplierService {
  async list() { return supplierRepository.findAll(); }
  async getById(id: string) { return supplierRepository.findById(id); }
  async create(data: CreateSupplierInput) { return supplierRepository.create(data); }
  async update(id: string, data: UpdateSupplierInput) { return supplierRepository.update(id, data); }
  async delete(id: string) { return supplierRepository.delete(id); }
}

export const supplierService = new SupplierService();
