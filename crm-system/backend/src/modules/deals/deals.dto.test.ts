import { describe, it, expect } from 'vitest';
import { createDealSchema, updateDealSchema } from './deals.dto';

describe('Deals DTO', () => {
  describe('createDealSchema', () => {
    it('validates correct input', () => {
      const result = createDealSchema.safeParse({
        title: 'Big Deal',
        amount: 50000,
        currency: 'USD',
        stage: 'new',
        probability: 10,
        customerId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing customerId', () => {
      const result = createDealSchema.safeParse({
        title: 'Big Deal',
      });
      expect(result.success).toBe(false);
    });

    it('rejects probability > 100', () => {
      const result = createDealSchema.safeParse({
        title: 'Deal',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        probability: 150,
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative amount', () => {
      const result = createDealSchema.safeParse({
        title: 'Deal',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        amount: -100,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid stage', () => {
      const result = createDealSchema.safeParse({
        title: 'Deal',
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        stage: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateDealSchema', () => {
    it('allows partial updates', () => {
      const result = updateDealSchema.safeParse({ stage: 'won' });
      expect(result.success).toBe(true);
    });

    it('does not allow updating customerId', () => {
      const data = updateDealSchema.safeParse({
        customerId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(data.success).toBe(true);
      if (data.success) {
        expect(data.data).not.toHaveProperty('customerId');
      }
    });
  });
});
