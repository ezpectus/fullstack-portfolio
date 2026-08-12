import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';
import type { RequestQuery } from './types';

export function parsePagination(query: RequestQuery) {
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(query.limit ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  );
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

export function generateBookingNumber(): string {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `BK-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bufferMinutes = 0,
): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const slotSize = durationMinutes + bufferMinutes;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const slotStart = `${Math.floor(currentMinutes / 60).toString().padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`;
    const slotEndMinutes = currentMinutes + durationMinutes;
    const slotEnd = `${Math.floor(slotEndMinutes / 60).toString().padStart(2, '0')}:${(slotEndMinutes % 60).toString().padStart(2, '0')}`;
    slots.push({ start: slotStart, end: slotEnd });
    currentMinutes += slotSize;
  }

  return slots;
}
