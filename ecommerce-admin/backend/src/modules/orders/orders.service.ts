import { ordersRepository } from './orders.repository';
import { prisma } from '../../config/db';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta, generateOrderNumber } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { CreateOrderInput, UpdateOrderStatusInput } from './orders.dto';

export class OrdersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { orders, total } = await ordersRepository.findMany({
      skip,
      limit,
      search: query.search,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return { data: orders, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const order = await ordersRepository.findById(id);
    if (!order) throw new NotFoundError('Order');
    return order;
  }

  async create(input: CreateOrderInput) {
    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw new NotFoundError('Customer');

    let subtotal = 0;
    const itemsData: any[] = [];
    for (const item of input.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId }, include: { variants: true } });
      if (!product) throw new NotFoundError('Product');
      const unitPrice = product.discountPrice ?? product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      itemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const taxTotal = subtotal * 0.1;
    const shippingTotal = subtotal > 100 ? 0 : 10;
    let discountTotal = 0;

    if (input.promoCodeId) {
      const promo = await prisma.promoCode.findUnique({ where: { id: input.promoCodeId } });
      if (!promo || !promo.isActive) throw new BadRequestError('Invalid promo code');
      if (promo.expiresAt && promo.expiresAt < new Date()) throw new BadRequestError('Promo code expired');
      if (promo.usageLimit && promo.usedCount >= promo.usageLimit) throw new BadRequestError('Promo code usage limit reached');
      if (subtotal < promo.minOrderValue) throw new BadRequestError('Order does not meet minimum value');
      discountTotal = promo.type === 'PERCENTAGE' ? (subtotal * promo.value) / 100 : promo.value;
    }

    const total = subtotal + taxTotal + shippingTotal - discountTotal;
    const orderNumber = generateOrderNumber();

    return ordersRepository.create({
      orderNumber,
      customerId: input.customerId,
      subtotal,
      taxTotal,
      shippingTotal,
      discountTotal,
      total,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      promoCodeId: input.promoCodeId,
      items: { create: itemsData },
      statusHistory: { create: [{ status: 'PENDING' }] },
    });
  }

  async updateStatus(id: string, input: UpdateOrderStatusInput, userId: string) {
    const order = await ordersRepository.findById(id);
    if (!order) throw new NotFoundError('Order');
    return ordersRepository.updateStatus(id, input.status, userId, input.comment);
  }
}

export const ordersService = new OrdersService();
