import { describe, it, expect } from 'vitest';
import { slugify, generateOrderNumber, parsePagination, buildPaginationMeta } from '../../src/shared/utils';

describe('Utils', () => {
  it('should slugify text', () => {
    expect(slugify('Premium Smartphone')).toBe('premium-smartphone');
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('should generate order number', () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^ORD-\d{8}-\d{4}$/);
  });

  it('should parse pagination', () => {
    const result = parsePagination({ page: '2', limit: '10' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(10);
  });

  it('should build pagination meta', () => {
    const meta = buildPaginationMeta(100, 2, 10);
    expect(meta.totalPages).toBe(10);
    expect(meta.total).toBe(100);
  });
});
