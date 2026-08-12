import { notesRepository } from './notes.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { ROLES } from '../../shared/constants';
import type { CreateNoteInput, UpdateNoteInput } from './notes.dto';
import type { Prisma } from '@prisma/client';
import type { AuthPayload } from '../../shared/types';

export class NotesService {
  async list(params: {
    page: number;
    limit: number;
    customerId?: string;
    dealId?: string;
    isPinned?: boolean;
    user: AuthPayload;
  }) {
    const skip = (params.page - 1) * params.limit;
    const where: Prisma.NoteWhereInput = {};

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    if (params.dealId) {
      where.dealId = params.dealId;
    }

    if (params.isPinned !== undefined) {
      where.isPinned = params.isPinned;
    }

    if (params.user.role === ROLES.SALES_REP) {
      where.createdById = params.user.userId;
    }

    const { data, total } = await notesRepository.findMany({ skip, take: params.limit, where });

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  async getById(id: string, user: AuthPayload) {
    const note = await notesRepository.findById(id);
    if (!note) {
      throw new NotFoundError('Note', id);
    }
    if (user.role === ROLES.SALES_REP && note.createdById !== user.userId) {
      throw new ForbiddenError('You can only view your own notes');
    }
    return note;
  }

  async create(input: CreateNoteInput, user: AuthPayload) {
    const data: Prisma.NoteCreateInput = {
      content: input.content,
      isPinned: input.isPinned,
      createdBy: { connect: { id: user.userId } },
    };

    if (input.customerId) {
      data.customer = { connect: { id: input.customerId } };
    }

    if (input.dealId) {
      data.deal = { connect: { id: input.dealId } };
    }

    return notesRepository.create(data);
  }

  async update(id: string, input: UpdateNoteInput, user: AuthPayload) {
    const note = await notesRepository.findById(id);
    if (!note) {
      throw new NotFoundError('Note', id);
    }
    if (user.role === ROLES.SALES_REP && note.createdById !== user.userId) {
      throw new ForbiddenError('You can only update your own notes');
    }

    const data: Prisma.NoteUpdateInput = {};
    if (input.content !== undefined) data.content = input.content;
    if (input.isPinned !== undefined) data.isPinned = input.isPinned;

    return notesRepository.update(id, data);
  }

  async delete(id: string, user: AuthPayload) {
    const note = await notesRepository.findById(id);
    if (!note) {
      throw new NotFoundError('Note', id);
    }
    if (user.role === ROLES.SALES_REP && note.createdById !== user.userId) {
      throw new ForbiddenError('You can only delete your own notes');
    }
    await notesRepository.delete(id);
  }

  async togglePin(id: string, user: AuthPayload) {
    const note = await notesRepository.findById(id);
    if (!note) {
      throw new NotFoundError('Note', id);
    }
    if (user.role === ROLES.SALES_REP && note.createdById !== user.userId) {
      throw new ForbiddenError('You can only pin your own notes');
    }
    return notesRepository.togglePin(id);
  }
}

export const notesService = new NotesService();
