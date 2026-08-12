export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'sales_rep';
  avatar?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  status: 'lead' | 'active' | 'inactive';
  tags: string[];
  avatar?: string | null;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  _count?: { deals: number; notes: number };
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  probability: number;
  expectedCloseDate?: string | null;
  customerId: string;
  customer?: { id: string; name: string; company?: string | null };
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  isPinned: boolean;
  customerId?: string | null;
  dealId?: string | null;
  customer?: { id: string; name: string } | null;
  deal?: { id: string; title: string } | null;
  createdById: string;
  createdBy?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeDeals: number;
  pipelineAmount: number;
  wonThisMonth: number;
}

export interface DealStageCount {
  stage: string;
  count: number;
}

export interface NewCustomerData {
  date: string;
  count: number;
}

export interface RecentActivity {
  type: 'deal' | 'customer' | 'note';
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  updatedAt: string;
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
