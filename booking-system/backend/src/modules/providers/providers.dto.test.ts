import { describe, it, expect } from 'vitest';
import { createProviderSchema, updateProviderSchema, paginationSchema } from './providers.dto';

describe('providers.dto', () => {
  describe('createProviderSchema', () => {
    it('validates a minimal provider', () => {
      const result = createProviderSchema.safeParse({ userId: 'user-1' });
      expect(result.success).toBe(true);
    });

    it('accepts bio and serviceIds', () => {
      const result = createProviderSchema.safeParse({ userId: 'user-1', bio: 'Experienced stylist', serviceIds: ['svc-1', 'svc-2'] });
      expect(result.success).toBe(true);
    });

    it('accepts workingHours', () => {
      const result = createProviderSchema.safeParse({
        userId: 'user-1',
        workingHours: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }],
      });
      expect(result.success).toBe(true);
    });

    it('rejects dayOfWeek < 0', () => {
      const result = createProviderSchema.safeParse({
        userId: 'user-1',
        workingHours: [{ dayOfWeek: -1, startTime: '09:00', endTime: '17:00' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects dayOfWeek > 6', () => {
      const result = createProviderSchema.safeParse({
        userId: 'user-1',
        workingHours: [{ dayOfWeek: 7, startTime: '09:00', endTime: '17:00' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing userId', () => {
      const result = createProviderSchema.safeParse({ bio: 'No user' });
      expect(result.success).toBe(false);
    });

    it('accepts isBreak in workingHours', () => {
      const result = createProviderSchema.safeParse({
        userId: 'user-1',
        workingHours: [{ dayOfWeek: 1, startTime: '12:00', endTime: '13:00', isBreak: true }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateProviderSchema', () => {
    it('allows partial update without userId', () => {
      const result = updateProviderSchema.safeParse({ bio: 'Updated bio' });
      expect(result.success).toBe(true);
    });

    it('allows updating workingHours', () => {
      const result = updateProviderSchema.safeParse({
        workingHours: [{ dayOfWeek: 0, startTime: '10:00', endTime: '16:00' }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
