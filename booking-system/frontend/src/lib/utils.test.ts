import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatTime, formatCurrency, getStatusColor } from './utils';

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
  });

  describe('formatDate', () => {
    it('should format a date string', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      expect(result).toMatch(/Jan/);
      expect(result).toMatch(/15/);
    });
  });

  describe('formatTime', () => {
    it('should format a time string', () => {
      const result = formatTime('2024-01-15T14:30:00Z');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('getStatusColor', () => {
    it('should return color for known status', () => {
      const result = getStatusColor('PENDING');
      expect(result).toContain('amber');
    });

    it('should return default color for unknown status', () => {
      const result = getStatusColor('UNKNOWN');
      expect(result).toContain('gray');
    });
  });
});
