import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class NotesRepository {
  async findMany(params: {
    skip: number;
    take: number;
    where: Prisma.NoteWhereInput;
  }) {
    const [data, total] = await Promise.all([
      prisma.note.findMany({
        where: params.where,
        skip: params.skip,
        take: params.take,
        include: {
          customer: { select: { id: true, name: true } },
          deal: { select: { id: true, title: true } },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.note.count({ where: params.where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.note.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: Prisma.NoteCreateInput) {
    return prisma.note.create({
      data,
      include: {
        customer: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: Prisma.NoteUpdateInput) {
    return prisma.note.update({
      where: { id },
      data,
      include: {
        customer: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.note.delete({ where: { id } });
  }

  async togglePin(id: string) {
    const note = await prisma.note.findUnique({ where: { id }, select: { isPinned: true } });
    if (!note) return null;
    return prisma.note.update({
      where: { id },
      data: { isPinned: !note.isPinned },
      include: {
        customer: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
  }
}

export const notesRepository = new NotesRepository();
