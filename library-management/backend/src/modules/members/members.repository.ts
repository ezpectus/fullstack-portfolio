import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class MembersRepository {
  async findMany(params: {
    where: Prisma.MemberWhereInput;
    include?: Prisma.MemberInclude;
    orderBy?: Prisma.MemberOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.member.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.MemberWhereInput) {
    return prisma.member.count({ where });
  }

  async findById(id: string, include?: Prisma.MemberInclude) {
    return prisma.member.findUnique({ where: { id }, include });
  }

  async findByUserId(userId: string) {
    return prisma.member.findUnique({ where: { userId } });
  }

  async update(id: string, data: Prisma.MemberUpdateInput, include?: Prisma.MemberInclude) {
    return prisma.member.update({ where: { id }, data, include });
  }
}

export const membersRepository = new MembersRepository();
