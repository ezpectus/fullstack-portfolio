import { finesRepository } from './fines.repository';
import { Prisma, FineStatus } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../shared/errors';

export class FinesService {
  async list(params: { page: number; limit: number; status?: string; memberId?: string }) {
    const { page, limit, status, memberId } = params;
    const where: Prisma.FineWhereInput = {};
    if (status) where.status = status as FineStatus;
    if (memberId) where.memberId = memberId;

    const include = { loan: { include: { bookCopy: { include: { book: true } } } }, member: { include: { user: true } } };

    const [items, total] = await Promise.all([
      finesRepository.findMany({
        where,
        include,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      finesRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const fine = await finesRepository.findById(id, {
      loan: { include: { bookCopy: { include: { book: true } } } },
      member: { include: { user: true } },
    });
    if (!fine) throw new NotFoundError('Fine');
    return fine;
  }

  async pay(id: string) {
    const fine = await finesRepository.findById(id);
    if (!fine) throw new NotFoundError('Fine');
    if (fine.status === 'PAID') throw new BadRequestError('Fine already paid');
    return finesRepository.update(id, { status: 'PAID', paidAt: new Date() }, { loan: true, member: { include: { user: true } } });
  }

  async waive(id: string) {
    const fine = await finesRepository.findById(id);
    if (!fine) throw new NotFoundError('Fine');
    if (fine.status === 'PAID') throw new BadRequestError('Cannot waive a paid fine');
    return finesRepository.update(id, { status: 'WAIVED' }, { loan: true, member: { include: { user: true } } });
  }
}

export const finesService = new FinesService();
