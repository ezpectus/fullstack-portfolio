import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('should merge tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD', () => {
      const result = formatCurrency(10.5);
      expect(result).toMatch(/\$10\.50/);
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toMatch(/\$0\.00/);
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toMatch(/1,000,000/);
    });
  });

  describe('formatDate', () => {
    it('should format a date string', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      expect(result).toMatch(/2024/);
    });
  });
});
