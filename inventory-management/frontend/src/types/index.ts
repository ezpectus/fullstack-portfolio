export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string | null;
  category?: Category | null;
  unit: string;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  barcode?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  managerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  warehouseId: string;
  warehouse?: Warehouse;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  fromWarehouseId?: string | null;
  comment?: string;
  userId: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  warehouseId: string;
  warehouse?: Warehouse;
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  total: number;
  userId: string;
  user?: { id: string; name: string };
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  totalMovements: number;
  lowStockAlerts: Product[];
  recentMovements: StockMovement[];
  movementsByType: { type: string; _count: number }[];
}

export interface InventoryTrend {
  date: string;
  in: number;
  out: number;
  transfer: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
