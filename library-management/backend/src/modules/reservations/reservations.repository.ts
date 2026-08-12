import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class ReservationsRepository {
  async findMany(params: {
    where: Prisma.ReservationWhereInput;
    include?: Prisma.ReservationInclude;
    orderBy?: Prisma.ReservationOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.reservation.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.ReservationWhereInput) {
    return prisma.reservation.count({ where });
  }

  async findById(id: string, include?: Prisma.ReservationInclude) {
    return prisma.reservation.findUnique({ where: { id }, include });
  }

  async findFirst(where: Prisma.ReservationWhereInput) {
    return prisma.reservation.findFirst({ where });
  }

  async create(data: Prisma.ReservationCreateInput, include?: Prisma.ReservationInclude) {
    return prisma.reservation.create({ data, include });
  }

  async update(id: string, data: Prisma.ReservationUpdateInput, include?: Prisma.ReservationInclude) {
    return prisma.reservation.update({ where: { id }, data, include });
  }
}

export const reservationsRepository = new ReservationsRepository();
