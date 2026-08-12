import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, formatDateTime, getInitials } from './utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('should merge conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('formatCurrency', () => {
  it('should format USD by default', () => {
    expect(formatCurrency(1500)).toBe('$1,500');
  });

  it('should format EUR', () => {
    expect(formatCurrency(2000, 'EUR')).toBe('€2,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatDate', () => {
  it('should format a date string', () => {
    const result = formatDate('2026-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });

  it('should format a Date object', () => {
    const result = formatDate(new Date('2026-06-01'));
    expect(result).toContain('Jun');
    expect(result).toContain('2026');
  });
});

describe('formatDateTime', () => {
  it('should include time in the output', () => {
    const result = formatDateTime('2026-01-15T10:30:00');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });
});

describe('getInitials', () => {
  it('should get initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should handle single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('should handle three names (take first two)', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('should uppercase the initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});
