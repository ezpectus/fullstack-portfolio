import { describe, it, expect } from 'vitest';
import { createBookSchema, paginationSchema } from './books.dto';

describe('Books DTOs', () => {
  describe('createBookSchema', () => {
    it('validates correct book data', () => {
      const result = createBookSchema.parse({
        isbn: '978-0-7432-7356-5',
        title: 'Test Book',
        authors: 'Test Author',
      });
      expect(result.title).toBe('Test Book');
    });

    it('rejects short ISBN', () => {
      expect(() => createBookSchema.parse({ isbn: '123', title: 'Test', authors: 'Author' })).toThrow();
    });

    it('rejects empty title', () => {
      expect(() => createBookSchema.parse({ isbn: '978-0-7432-7356-5', title: '', authors: 'Author' })).toThrow();
    });

    it('accepts optional fields', () => {
      const result = createBookSchema.parse({
        isbn: '978-0-7432-7356-5',
        title: 'Test',
        authors: 'Author',
        publisher: 'Pub',
        publishYear: 2020,
        genre: 'Fiction',
      });
      expect(result.publishYear).toBe(2020);
    });
  });

  describe('paginationSchema', () => {
    it('uses default values', () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.sortBy).toBe('createdAt');
      expect(result.sortOrder).toBe('desc');
    });

    it('coerces string numbers', () => {
      const result = paginationSchema.parse({ page: '3', limit: '50' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(50);
    });

    it('rejects page < 1', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();
    });

    it('rejects limit > 100', () => {
      expect(() => paginationSchema.parse({ limit: 200 })).toThrow();
    });
  });
});
