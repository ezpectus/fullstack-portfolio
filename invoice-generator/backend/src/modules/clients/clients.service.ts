import { clientsRepository } from './clients.repository';
import { NotFoundError } from '../../shared/errors';
import type { Prisma } from '@prisma/client';

export class ClientsService {
  async list(userId: string, page: number, limit: number, search?: string, sortBy?: string, sortOrder?: string) {
    const where: Prisma.ClientWhereInput = {
      ...(search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { company: { contains: search, mode: 'insensitive' } }] }
        : {}),
    };
    const orderBy: Prisma.ClientOrderByWithRelationInput = { [sortBy || 'createdAt']: sortOrder || 'desc' };
    const { items, total } = await clientsRepository.findMany(userId, (page - 1) * limit, limit, where, orderBy);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(userId: string, id: string) {
    const client = await clientsRepository.findById(id, userId);
    if (!client) throw new NotFoundError('Client');
    return client;
  }

  async getBalance(userId: string, id: string) {
    const client = await clientsRepository.findById(id, userId);
    if (!client) throw new NotFoundError('Client');
    const stats = await clientsRepository.getStats(userId);
    const stat = stats.find((s) => s.id === id);
    return stat || { billed: 0, paid: 0, outstanding: 0 };
  }

  async create(userId: string, data: Omit<Prisma.ClientUncheckedCreateInput, 'userId'>) {
    return clientsRepository.create({ ...data, userId });
  }

  async update(userId: string, id: string, data: Prisma.ClientUpdateInput) {
    const client = await clientsRepository.findById(id, userId);
    if (!client) throw new NotFoundError('Client');
    return clientsRepository.update(id, userId, data);
  }

  async delete(userId: string, id: string) {
    const client = await clientsRepository.findById(id, userId);
    if (!client) throw new NotFoundError('Client');
    await clientsRepository.delete(id, userId);
    return { message: 'Client deleted' };
  }
}

export const clientsService = new ClientsService();
