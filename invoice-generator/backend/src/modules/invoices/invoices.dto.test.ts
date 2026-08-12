import { describe, it, expect } from 'vitest';
import { createInvoiceSchema, invoiceItemSchema, invoiceStatusSchema, invoicePaginationSchema } from './invoices.dto';

describe('Invoices DTOs', () => {
  describe('invoiceItemSchema', () => {
    it('validates a correct item', () => {
      const result = invoiceItemSchema.safeParse({
        description: 'Web Development',
        quantity: 10,
        unit: 'hrs',
        unitPrice: 75,
        taxRate: 10,
        discount: 0,
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative quantity', () => {
      const result = invoiceItemSchema.safeParse({
        description: 'Test',
        quantity: -1,
        unit: 'hrs',
        unitPrice: 50,
        taxRate: 0,
        discount: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty description', () => {
      const result = invoiceItemSchema.safeParse({
        description: '',
        quantity: 1,
        unit: 'pcs',
        unitPrice: 10,
        taxRate: 0,
        discount: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createInvoiceSchema', () => {
    it('validates a correct invoice', () => {
      const result = createInvoiceSchema.safeParse({
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        dueDate: '2025-12-31',
        items: [{ description: 'Test Item', quantity: 1, unitPrice: 100 }],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty items array', () => {
      const result = createInvoiceSchema.safeParse({
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        dueDate: '2025-12-31',
        items: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid clientId', () => {
      const result = createInvoiceSchema.safeParse({
        clientId: 'not-a-uuid',
        dueDate: '2025-12-31',
        items: [{ description: 'Test', quantity: 1, unitPrice: 100 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('invoiceStatusSchema', () => {
    it('validates correct status', () => {
      expect(invoiceStatusSchema.safeParse({ status: 'DRAFT' }).success).toBe(true);
      expect(invoiceStatusSchema.safeParse({ status: 'PAID' }).success).toBe(true);
      expect(invoiceStatusSchema.safeParse({ status: 'CANCELLED' }).success).toBe(true);
    });

    it('rejects invalid status', () => {
      expect(invoiceStatusSchema.safeParse({ status: 'INVALID' }).success).toBe(false);
    });
  });

  describe('invoicePaginationSchema', () => {
    it('applies defaults', () => {
      const result = invoicePaginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('accepts valid status filter', () => {
      const result = invoicePaginationSchema.safeParse({ status: 'PAID' });
      expect(result.success).toBe(true);
    });
  });
});
