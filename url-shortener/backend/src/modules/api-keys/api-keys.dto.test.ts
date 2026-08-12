import { describe, it, expect } from 'vitest';
import { createApiKeySchema } from './api-keys.dto';

describe('API Keys DTO', () => {
  describe('createApiKeySchema', () => {
    it('should accept valid name', () => {
      const result = createApiKeySchema.safeParse({ name: 'My API Key' });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = createApiKeySchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name over 100 chars', () => {
      const result = createApiKeySchema.safeParse({ name: 'a'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const result = createApiKeySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
