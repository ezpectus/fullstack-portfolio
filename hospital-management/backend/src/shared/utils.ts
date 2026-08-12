import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';

export function paginate(page?: number, limit?: number) {
  const p = Math.max(1, page ?? 1);
  const l = Math.min(MAX_PAGE_SIZE, Math.max(1, limit ?? DEFAULT_PAGE_SIZE));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

export function buildSearchFilter(fields: string[], query?: string) {
  if (!query) return {};
  return {
    OR: fields.map((field) => ({ [field]: { contains: query, mode: 'insensitive' as const } })),
  };
}

export function generateMedicalRecordId(): string {
  return `MR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
