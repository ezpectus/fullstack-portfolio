import { describe, it, expect } from 'vitest';
import { createCategorySchema, updateCategorySchema, paginationSchema } from './categories.dto';

describe('categories.dto', () => {
  describe('createCategorySchema', () => {
    it('validates a correct category payload', () => {
      const result = createCategorySchema.safeParse({ name: 'Electronics' });
      expect(result.success).toBe(true);
    });

    it('accepts optional slug', () => {
      const result = createCategorySchema.safeParse({ name: 'Electronics', slug: 'electronics' });
      expect(result.success).toBe(true);
    });

    it('rejects a name shorter than 2 chars', () => {
      const result = createCategorySchema.safeParse({ name: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects a slug shorter than 2 chars', () => {
      const result = createCategorySchema.safeParse({ name: 'Test', slug: 'A' });
      expect(result.success).toBe(false);
    });

    it('accepts parentId as UUID', () => {
      const result = createCategorySchema.safeParse({
        name: 'Phones',
        parentId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid parentId (non-UUID)', () => {
      const result = createCategorySchema.safeParse({ name: 'Phones', parentId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('accepts nullable parentId', () => {
      const result = createCategorySchema.safeParse({ name: 'Root', parentId: null });
      expect(result.success).toBe(true);
    });
  });

  describe('updateCategorySchema', () => {
    it('allows partial updates', () => {
      const result = updateCategorySchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('accepts search and parentId', () => {
      const result = paginationSchema.safeParse({ search: 'elec', parentId: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result.success).toBe(true);
    });
  });
});
