import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';
import type { CreateSupplierInput, UpdateSupplierInput } from './suppliers.dto';

export class SupplierRepository {
  async findAll() {
    return prisma.supplier.findMany({ include: { purchaseOrders: true }, orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { purchaseOrders: { include: { items: true }, orderBy: { createdAt: 'desc' } } },
    });
    if (!supplier) throw new NotFoundError('Supplier');
    return supplier;
  }

  async create(data: CreateSupplierInput) {
    return prisma.supplier.create({ data });
  }

  async update(id: string, data: UpdateSupplierInput) {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundError('Supplier');
    return prisma.supplier.update({ where: { id }, data });
  }

  async delete(id: string) {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundError('Supplier');
    return prisma.supplier.delete({ where: { id } });
  }
}

export const supplierRepository = new SupplierRepository();
