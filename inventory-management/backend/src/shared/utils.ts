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

export function generatePoNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO-${year}${month}-${random}`;
}

export function generateBarcode(sku: string): string {
  return sku.replace(/[^A-Z0-9]/gi, '').toUpperCase().padEnd(8, '0');
}
