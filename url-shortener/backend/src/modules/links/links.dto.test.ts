import { describe, it, expect } from 'vitest';
import { createLinkSchema } from './links.dto';

describe('createLinkSchema', () => {
  it('should accept valid URL', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'https://example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid URL', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('should accept optional alias', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'https://example.com', alias: 'mylink' });
    expect(result.success).toBe(true);
  });

  it('should reject short alias', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'https://example.com', alias: 'ab' });
    expect(result.success).toBe(false);
  });
});
