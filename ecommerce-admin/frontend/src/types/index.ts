export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ProductStatus {
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  price: number;
  discountPrice?: number | null;
  stock: number;
  tags: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: string | null;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  _count?: { products: number };
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  comment?: string;
  createdAt: string;
  user?: { id: string; name: string };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  shippingAddress?: string;
  notes?: string;
  customer?: Customer;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  promoCode?: PromoCode | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'BLOCKED';
  segment: 'VIP' | 'REGULAR' | 'NEW';
  totalSpend: number;
  addresses?: CustomerAddress[];
  orders?: Order[];
  _count?: { orders: number };
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue: number;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  _count?: { orders: number };
  createdAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentOrders: Order[];
}

export interface AnalyticsSummary {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  refundRate: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface OrdersPoint {
  date: string;
  count: number;
}

export interface TopProduct {
  productId: string;
  _sum: { quantity: number; totalPrice: number };
  product: Product;
}

export interface TopCategory {
  id: string;
  name: string;
  revenue: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
