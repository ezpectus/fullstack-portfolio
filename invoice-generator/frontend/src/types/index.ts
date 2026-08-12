export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type Role = 'OWNER' | 'ACCOUNTANT' | 'VIEWER';

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

export interface Company {
  id: string;
  userId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  logo?: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  bankSwift?: string;
  invoicePrefix: string;
  invoiceStart: number;
  emailSubject: string;
  emailBody: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  company?: string;
  email: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { invoices: number };
  invoices?: Invoice[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  userId: string;
  clientId: string;
  client?: Client;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes?: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  paidAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  counts: { total: number; draft: number; sent: number; paid: number; overdue: number };
  monthly: { billed: number; paid: number };
  overdueAmount: number;
  recentInvoices: Invoice[];
  monthlyRevenue: { month: string; billed: number; paid: number }[];
  topClients: { id: string; name: string; totalBilled: number }[];
}

export interface ClientBalance {
  billed: number;
  paid: number;
  outstanding: number;
}
