import { describe, it, expect } from 'vitest';
import { createNoteSchema, updateNoteSchema, noteQuerySchema } from './notes.dto';

describe('Notes DTO', () => {
  describe('createNoteSchema', () => {
    it('validates correct input with customerId', () => {
      const result = createNoteSchema.safeParse({
        content: 'Meeting scheduled',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('validates correct input with dealId', () => {
      const result = createNoteSchema.safeParse({
        content: 'Follow up needed',
        dealId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty content', () => {
      const result = createNoteSchema.safeParse({
        content: '',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(false);
    });

    it('rejects note without customerId or dealId', () => {
      const result = createNoteSchema.safeParse({
        content: 'Orphan note',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid UUID for customerId', () => {
      const result = createNoteSchema.safeParse({
        content: 'Test note',
        customerId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('accepts isPinned boolean', () => {
      const result = createNoteSchema.safeParse({
        content: 'Pinned note',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        isPinned: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPinned).toBe(true);
      }
    });
  });

  describe('updateNoteSchema', () => {
    it('validates content update', () => {
      const result = updateNoteSchema.safeParse({ content: 'Updated content' });
      expect(result.success).toBe(true);
    });

    it('validates isPinned update', () => {
      const result = updateNoteSchema.safeParse({ isPinned: true });
      expect(result.success).toBe(true);
    });

    it('validates empty object', () => {
      const result = updateNoteSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('rejects empty content string', () => {
      const result = updateNoteSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('noteQuerySchema', () => {
    it('defaults page and limit', () => {
      const result = noteQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('parses page and limit strings to numbers', () => {
      const result = noteQuerySchema.safeParse({ page: '3', limit: '50' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.limit).toBe(50);
      }
    });

    it('accepts isPinned enum', () => {
      const result = noteQuerySchema.safeParse({ isPinned: 'true' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid isPinned value', () => {
      const result = noteQuerySchema.safeParse({ isPinned: 'maybe' });
      expect(result.success).toBe(false);
    });
  });
});
