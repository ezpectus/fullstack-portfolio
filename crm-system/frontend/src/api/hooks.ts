import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/auth';
import { queryClient } from '@/lib/queryClient';
import type {
  Customer,
  Deal,
  Note,
  DashboardStats,
  DealStageCount,
  NewCustomerData,
  RecentActivity,
  PaginatedResponse,
  User,
} from '@/types';

// ─── Auth ───
export function useRegister() {
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post('/auth/register', data);
      return res.data.data;
    },
    onError: (error: unknown) => {
      toast.error('Registration failed');
      console.error('Register error:', error);
    },
  });
}

export function useLogin() {
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data.data;
    },
    onError: (error: unknown) => {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    },
  });
}

export function useMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data as User;
    },
    enabled: isAuthenticated,
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore — proceed with local logout
    }
    logout();
    queryClient.clear();
  };
}

// ─── Customers ───
export function useCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const res = await api.get('/customers', { params });
      return res.data as PaginatedResponse<Customer>;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await api.get(`/customers/${id}`);
      return res.data.data as Customer;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: Partial<Customer>) => {
      const res = await api.post('/customers', data);
      return res.data.data as Customer;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
    onError: (error: unknown) => {
      toast.error('Failed to create customer');
      console.error('Create customer error:', error);
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const res = await api.put(`/customers/${id}`, data);
      return res.data.data as Customer;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
    onError: (error: unknown) => {
      toast.error('Failed to update customer');
      console.error('Update customer error:', error);
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
    onError: (error: unknown) => {
      toast.error('Failed to delete customer');
      console.error('Delete customer error:', error);
    },
  });
}

// ─── Deals ───
export function useDeals(params?: {
  page?: number;
  limit?: number;
  stage?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: async () => {
      const res = await api.get('/deals', { params });
      return res.data as PaginatedResponse<Deal>;
    },
  });
}

export function useCreateDeal() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: Partial<Deal>) => {
      const res = await api.post('/deals', data);
      return res.data.data as Deal;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
    onError: (error: unknown) => {
      toast.error('Failed to create deal');
      console.error('Create deal error:', error);
    },
  });
}

export function useUpdateDeal() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Deal> }) => {
      const res = await api.put(`/deals/${id}`, data);
      return res.data.data as Deal;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
    onError: (error: unknown) => {
      toast.error('Failed to update deal');
      console.error('Update deal error:', error);
    },
  });
}

export function useDeleteDeal() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/deals/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
    onError: (error: unknown) => {
      toast.error('Failed to delete deal');
      console.error('Delete deal error:', error);
    },
  });
}

// ─── Notes ───
export function useNotes(params?: { customerId?: string; dealId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const res = await api.get('/notes', { params });
      return res.data as PaginatedResponse<Note>;
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: { content: string; customerId?: string; dealId?: string; isPinned?: boolean }) => {
      const res = await api.post('/notes', data);
      return res.data.data as Note;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    onError: (error: unknown) => {
      toast.error('Failed to create note');
      console.error('Create note error:', error);
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Note> }) => {
      const res = await api.put(`/notes/${id}`, data);
      return res.data.data as Note;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    onError: (error: unknown) => {
      toast.error('Failed to update note');
      console.error('Update note error:', error);
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    onError: (error: unknown) => {
      toast.error('Failed to delete note');
      console.error('Delete note error:', error);
    },
  });
}

// ─── Dashboard ───
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data as DashboardStats;
    },
  });
}

export function useDashboardDealsByStage() {
  return useQuery({
    queryKey: ['dashboard', 'deals-by-stage'],
    queryFn: async () => {
      const res = await api.get('/dashboard/deals-by-stage');
      return res.data.data as DealStageCount[];
    },
  });
}

export function useDashboardNewCustomers() {
  return useQuery({
    queryKey: ['dashboard', 'new-customers'],
    queryFn: async () => {
      const res = await api.get('/dashboard/new-customers');
      return res.data.data as NewCustomerData[];
    },
  });
}

export function useDashboardRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent-activity');
      return res.data.data as RecentActivity[];
    },
  });
}

// ─── Users ───
export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await api.get('/users', { params });
      return res.data as PaginatedResponse<User>;
    },
  });
}

// ─── Export ───
export function useExportCustomers() {
  const toast = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await api.get('/export/customers', { responseType: 'blob' });
      return res.data;
    },
    onError: (error: unknown) => {
      toast.error('Failed to export customers');
      console.error('Export customers error:', error);
    },
  });
}

export function useExportDeals() {
  const toast = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await api.get('/export/deals', { responseType: 'blob' });
      return res.data;
    },
    onError: (error: unknown) => {
      toast.error('Failed to export deals');
      console.error('Export deals error:', error);
    },
  });
}
