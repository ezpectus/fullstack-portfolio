import { describe, it, expect } from 'vitest';
import { blockSlotsSchema, getSlotsSchema } from './schedule.dto';

describe('schedule.dto', () => {
  describe('blockSlotsSchema', () => {
    it('validates a correct block payload', () => {
      const result = blockSlotsSchema.safeParse({
        providerId: 'prov-1',
        startDate: '2024-12-01T09:00:00Z',
        endDate: '2024-12-01T17:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional reason', () => {
      const result = blockSlotsSchema.safeParse({
        providerId: 'prov-1',
        startDate: '2024-12-01T09:00:00Z',
        endDate: '2024-12-01T17:00:00Z',
        reason: 'Lunch break',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing providerId', () => {
      const result = blockSlotsSchema.safeParse({ startDate: '2024-12-01T09:00:00Z', endDate: '2024-12-01T17:00:00Z' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime', () => {
      const result = blockSlotsSchema.safeParse({ providerId: 'prov-1', startDate: 'not-a-date', endDate: '2024-12-01T17:00:00Z' });
      expect(result.success).toBe(false);
    });
  });

  describe('getSlotsSchema', () => {
    it('validates a correct date and serviceId', () => {
      const result = getSlotsSchema.safeParse({ date: '2024-12-01', serviceId: 'svc-1' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid date format', () => {
      const result = getSlotsSchema.safeParse({ date: '12/01/2024', serviceId: 'svc-1' });
      expect(result.success).toBe(false);
    });

    it('rejects missing serviceId', () => {
      const result = getSlotsSchema.safeParse({ date: '2024-12-01' });
      expect(result.success).toBe(false);
    });

    it('rejects missing date', () => {
      const result = getSlotsSchema.safeParse({ serviceId: 'svc-1' });
      expect(result.success).toBe(false);
    });
  });
});
