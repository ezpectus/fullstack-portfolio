import { describe, it, expect } from 'vitest';
import { generateBookingNumber, slugify, generateTimeSlots, parsePagination, buildPaginationMeta } from '../src/shared/utils';

describe('Utils', () => {
  describe('generateBookingNumber', () => {
    it('should generate a booking number with BK- prefix', () => {
      const result = generateBookingNumber();
      expect(result).toMatch(/^BK-\d{6}$/);
    });

    it('should generate unique numbers', () => {
      const numbers = new Set(Array.from({ length: 100 }, () => generateBookingNumber()));
      expect(numbers.size).toBeGreaterThan(90);
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hair Cutting')).toBe('hair-cutting');
      expect(slugify('Deep Tissue Massage!')).toBe('deep-tissue-massage');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('generateTimeSlots', () => {
    it('should generate correct slots for 60min duration', () => {
      const slots = generateTimeSlots('09:00', '11:00', 60, 0);
      expect(slots).toHaveLength(2);
      expect(slots[0]).toEqual({ start: '09:00', end: '10:00' });
      expect(slots[1]).toEqual({ start: '10:00', end: '11:00' });
    });

    it('should generate correct slots with buffer', () => {
      const slots = generateTimeSlots('09:00', '11:00', 60, 15);
      expect(slots).toHaveLength(1);
      expect(slots[0]).toEqual({ start: '09:00', end: '10:00' });
    });

    it('should handle 30min slots', () => {
      const slots = generateTimeSlots('09:00', '10:00', 30, 0);
      expect(slots).toHaveLength(2);
      expect(slots[0]).toEqual({ start: '09:00', end: '09:30' });
      expect(slots[1]).toEqual({ start: '09:30', end: '10:00' });
    });

    it('should return empty array if not enough time', () => {
      const slots = generateTimeSlots('09:00', '09:30', 60, 0);
      expect(slots).toHaveLength(0);
    });
  });

  describe('parsePagination', () => {
    it('should use defaults when no query', () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should parse page and limit', () => {
      const result = parsePagination({ page: '3', limit: '10' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(20);
    });

    it('should enforce max page size', () => {
      const result = parsePagination({ limit: '500' });
      expect(result.limit).toBe(100);
    });

    it('should handle invalid values', () => {
      const result = parsePagination({ page: 'invalid', limit: 'invalid' });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('buildPaginationMeta', () => {
    it('should calculate total pages correctly', () => {
      const meta = buildPaginationMeta(100, 1, 20);
      expect(meta.totalPages).toBe(5);
    });

    it('should handle zero total', () => {
      const meta = buildPaginationMeta(0, 1, 20);
      expect(meta.totalPages).toBe(1);
    });

    it('should round up for partial pages', () => {
      const meta = buildPaginationMeta(25, 1, 20);
      expect(meta.totalPages).toBe(2);
    });
  });
});
