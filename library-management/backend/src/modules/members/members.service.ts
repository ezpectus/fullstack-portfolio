import { membersRepository } from './members.repository';
import { loansRepository } from '../loans/loans.repository';
import { finesRepository } from '../fines/fines.repository';
import { NotFoundError } from '../../shared/errors';
import { MemberStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export class MembersService {
  async list(params: { page: number; limit: number; search?: string; status?: MemberStatus }) {
    const { page, limit, search, status } = params;
    const where: Prisma.MemberWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { cardNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const include = { user: { select: { id: true, name: true, email: true } }, _count: { select: { loans: true, fines: true } } };

    const [items, total] = await Promise.all([
      membersRepository.findMany({
        where,
        include,
        orderBy: { joinedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      membersRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const member = await membersRepository.findById(id, {
      user: { select: { id: true, name: true, email: true } },
      loans: { include: { bookCopy: { include: { book: true } } }, orderBy: { borrowedAt: 'desc' }, take: 10 },
      fines: { orderBy: { createdAt: 'desc' } },
      _count: { select: { loans: true, fines: true, reservations: true } },
    });
    if (!member) throw new NotFoundError('Member');
    return member;
  }

  async update(id: string, data: { phone?: string; address?: string; status?: MemberStatus }) {
    const member = await membersRepository.findById(id);
    if (!member) throw new NotFoundError('Member');
    return membersRepository.update(id, data, { user: { select: { name: true, email: true } } });
  }

  async getLoans(id: string) {
    return loansRepository.findMany({
      where: { memberId: id },
      include: { bookCopy: { include: { book: true } }, fine: true },
      orderBy: { borrowedAt: 'desc' },
      skip: 0,
      take: 1000,
    });
  }

  async getFines(id: string) {
    return finesRepository.findMany({
      where: { memberId: id },
      include: { loan: { include: { bookCopy: { include: { book: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 1000,
    });
  }
}

export const membersService = new MembersService();
