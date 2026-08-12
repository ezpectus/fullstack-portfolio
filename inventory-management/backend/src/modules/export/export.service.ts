import { exportRepository } from './export.repository';
import type { Product, StockMovement, PurchaseOrder } from '@prisma/client';

function escapeCsvField(value: string): string {
  let escaped = value.replace(/"/g, '""');
  if (/^[=+\-@]/.test(escaped)) {
    escaped = `'${escaped}`;
  }
  return `"${escaped}"`;
}

function buildCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvField(cell)).join(','))
    .join('\n');
}

export class ExportService {
  async exportProductsCSV(): Promise<string> {
    const products = await exportRepository.findAllProductsWithCategory();

    const headers = ['SKU', 'Name', 'Description', 'Category', 'Unit', 'Min Stock', 'Cost Price', 'Sell Price', 'Barcode'];
    const rows = products.map((p: Product & { category: { name: string } | null }) => [
      p.sku,
      p.name,
      p.description || '',
      p.category?.name || '',
      p.unit,
      String(p.minStock),
      String(p.costPrice),
      String(p.sellPrice),
      p.barcode || '',
    ]);

    return buildCsv(headers, rows);
  }

  async exportStockMovementsCSV(): Promise<string> {
    const movements = await exportRepository.findAllStockMovements();

    const headers = ['Date', 'Product SKU', 'Product Name', 'Warehouse', 'Type', 'Quantity', 'User', 'Comment'];
    const rows = movements.map((m: StockMovement & { product: { sku: string; name: string }; warehouse: { name: string }; user: { name: string } | null }) => [
      m.createdAt.toISOString(),
      m.product.sku,
      m.product.name,
      m.warehouse.name,
      m.type,
      String(m.quantity),
      m.user?.name || '',
      m.comment || '',
    ]);

    return buildCsv(headers, rows);
  }

  async exportPurchaseOrdersCSV(): Promise<string> {
    const orders = await exportRepository.findAllPurchaseOrders();

    const headers = ['PO Number', 'Date', 'Supplier', 'Status', 'Total', 'Items Count'];
    const rows = orders.map((o: PurchaseOrder & { supplier: { name: string }; items: unknown[] }) => [
      o.poNumber,
      o.createdAt.toISOString(),
      o.supplier.name,
      o.status,
      String(o.total),
      String(o.items.length),
    ]);

    return buildCsv(headers, rows);
  }
}

export const exportService = new ExportService();
