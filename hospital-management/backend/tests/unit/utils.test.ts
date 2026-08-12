import { describe, it, expect } from 'vitest';
import { paginate, buildSearchFilter, generateMedicalRecordId } from '../../src/shared/utils';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../src/shared/constants';

describe('Utils', () => {
  describe('paginate', () => {
    it('returns default values when no params', () => {
      const result = paginate();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(DEFAULT_PAGE_SIZE);
      expect(result.skip).toBe(0);
      expect(result.take).toBe(DEFAULT_PAGE_SIZE);
    });

    it('calculates skip correctly for page 2', () => {
      const result = paginate(2, 10);
      expect(result.skip).toBe(10);
      expect(result.take).toBe(10);
      expect(result.page).toBe(2);
    });

    it('clamps limit to MAX_PAGE_SIZE', () => {
      const result = paginate(1, 500);
      expect(result.limit).toBe(MAX_PAGE_SIZE);
      expect(result.take).toBe(MAX_PAGE_SIZE);
    });

    it('clamps page to minimum 1', () => {
      const result = paginate(0, 10);
      expect(result.page).toBe(1);
    });

    it('clamps limit to minimum 1', () => {
      const result = paginate(1, 0);
      expect(result.limit).toBe(1);
    });
  });

  describe('buildSearchFilter', () => {
    it('returns empty object when no query', () => {
      const result = buildSearchFilter(['name', 'email']);
      expect(result).toEqual({});
    });

    it('builds OR filter with contains', () => {
      const result = buildSearchFilter(['name', 'email'], 'test') as any;
      expect(result.OR).toHaveLength(2);
      expect(result.OR[0].name.contains).toBe('test');
      expect(result.OR[1].email.contains).toBe('test');
    });
  });

  describe('generateMedicalRecordId', () => {
    it('generates unique IDs', () => {
      const id1 = generateMedicalRecordId();
      const id2 = generateMedicalRecordId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^MR-\d+-[A-Z0-9]+$/);
    });
  });
});
