import { prisma } from '../../config/db';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { generatePoNumber } from '../../shared/utils';
import type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput, PurchaseOrderPaginationInput } from './purchase-orders.dto';
import type { Prisma } from '@prisma/client';

export class PurchaseOrderRepository {
  async findMany(params: PurchaseOrderPaginationInput) {
    const { page, limit, status, supplierId } = params;
    const where: Prisma.PurchaseOrderWhereInput = {};
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;

    const [items, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: { supplier: true, items: { include: { product: true } }, user: { select: { id: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true } }, user: { select: { id: true, name: true } } },
    });
    if (!order) throw new NotFoundError('Purchase order');
    return order;
  }

  async create(data: CreatePurchaseOrderInput, userId: string) {
    const poNumber = generatePoNumber();
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        warehouseId: data.warehouseId,
        userId,
        total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { supplier: true, warehouse: true, items: { include: { product: true } } },
    });
  }

  async update(id: string, data: UpdatePurchaseOrderInput) {
    const order = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Purchase order');
    if (order.status !== 'DRAFT') throw new BadRequestError('Only draft orders can be updated');

    return prisma.$transaction(async (tx) => {
      const updateData: Prisma.PurchaseOrderUpdateInput = {};
      if (data.supplierId) updateData.supplier = { connect: { id: data.supplierId } };
      if (data.warehouseId) updateData.warehouse = { connect: { id: data.warehouseId } };

      if (data.items) {
        const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        updateData.total = total;
        await tx.purchaseOrderItem.deleteMany({ where: { orderId: id } });
        updateData.items = {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        };
      }

      return tx.purchaseOrder.update({
        where: { id },
        data: updateData,
        include: { supplier: true, warehouse: true, items: { include: { product: true } } },
      });
    });
  }

  async send(id: string) {
    const order = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Purchase order');
    if (order.status !== 'DRAFT') throw new BadRequestError('Only draft orders can be sent');
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'SENT' },
      include: { supplier: true, warehouse: true, items: { include: { product: true } } },
    });
  }

  async receive(id: string, userId: string) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundError('Purchase order');
    if (order.status !== 'SENT') throw new BadRequestError('Only sent orders can be received');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.purchaseOrder.update({
        where: { id },
        data: { status: 'RECEIVED' },
        include: { supplier: true, warehouse: true, items: { include: { product: true } } },
      });

      await Promise.all(
        order.items.map((item) =>
          tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: order.warehouseId,
              type: 'IN',
              quantity: item.quantity,
              comment: `Received via PO ${order.poNumber}`,
              userId,
            },
          }),
        ),
      );

      await Promise.all(
        order.items.map((item) =>
          tx.stockLevel.upsert({
            where: { productId_warehouseId: { productId: item.productId, warehouseId: order.warehouseId } },
            create: { productId: item.productId, warehouseId: order.warehouseId, quantity: item.quantity },
            update: { quantity: { increment: item.quantity } },
          }),
        ),
      );

      return updated;
    });
  }

  async delete(id: string) {
    const order = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Purchase order');
    if (order.status !== 'DRAFT') throw new BadRequestError('Only draft orders can be deleted');
    return prisma.purchaseOrder.delete({ where: { id } });
  }
}

export const purchaseOrderRepository = new PurchaseOrderRepository();
