import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';
import type { RequestQuery } from './types';

export function parsePagination(query: RequestQuery) {
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(query.limit ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function parseTags(tags?: string): string[] | undefined {
  if (!tags) return undefined;
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
}

export function buildWhereClause(filters: {
  search?: string;
  status?: string;
  tags?: string[];
  assignedToId?: string;
}): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { company: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  if (filters.assignedToId) {
    where.assignedToId = filters.assignedToId;
  }

  return where;
}
