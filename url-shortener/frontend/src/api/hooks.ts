import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  shortUrl?: string;
  _count?: { clicks: number };
}

export interface PaginatedLinks {
  items: Link[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  clicksByDay: { date: string; count: number }[];
  topLinks: { id: string; shortCode: string; originalUrl: string; clicks: number }[];
  recentLinks: { id: string; shortCode: string; originalUrl: string; createdAt: string }[];
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  clicksByDay: { date: string; count: number }[];
  topCountries: { country: string; count: number }[];
  topDevices: { device: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
  topReferers: { referer: string; count: number }[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  domain: string;
  codeLength: number;
  blacklist: string[];
}

function useMutationError() {
  const { addToast } = useToastStore();
  return (err: unknown) => {
    const message = err instanceof Error ? err.message : 'An error occurred';
    addToast('error', message);
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data as { user: { id: string; email: string; name: string; role: string }; accessToken: string; refreshToken: string };
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const res = await api.post('/auth/register', data);
      return res.data as { user: { id: string; email: string; name: string; role: string }; accessToken: string; refreshToken: string };
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      await api.post('/auth/logout', { refreshToken });
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    enabled: !!token,
  });
}

export function useLinks(params?: { page?: number; limit?: number; search?: string; status?: string; sort?: string; order?: string }) {
  return useQuery({
    queryKey: ['links', params],
    queryFn: async () => {
      const res = await api.get('/links', { params });
      return res.data as PaginatedLinks;
    },
  });
}

export function useLink(id: string) {
  return useQuery({
    queryKey: ['link', id],
    queryFn: async () => {
      const res = await api.get(`/links/${id}`);
      return res.data as Link;
    },
    enabled: !!id,
  });
}

export function useCreateLink() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async (data: { originalUrl: string; alias?: string; expiresAt?: string; password?: string }) => {
      const res = await api.post('/links', data);
      return res.data as Link;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['links'] }),
    onError,
  });
}

export function useUpdateLink() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; originalUrl?: string; alias?: string; status?: string }) => {
      const res = await api.put(`/links/${id}`, data);
      return res.data as Link;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['links'] }),
    onError,
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/links/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['links'] }),
    onError,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data as DashboardStats;
    },
  });
}

export function useAnalytics(linkId?: string) {
  return useQuery({
    queryKey: ['analytics', linkId],
    queryFn: async () => {
      const url = linkId ? `/analytics/${linkId}` : '/analytics';
      const res = await api.get(url);
      return res.data as AnalyticsData;
    },
  });
}

export function useQrCode(linkId: string) {
  return useQuery({
    queryKey: ['qr', linkId],
    queryFn: async () => {
      const res = await api.get(`/qr/${linkId}`);
      return res.data as { qrCode: string; shortUrl: string };
    },
    enabled: !!linkId,
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await api.get('/api-keys');
      return res.data as ApiKey[];
    },
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.post('/api-keys', data);
      return res.data as ApiKey;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
    onError,
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api-keys/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
    onError,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data as Settings;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const onError = useMutationError();
  return useMutation({
    mutationFn: async (data: { domain?: string; codeLength?: number; blacklist?: string[] }) => {
      const res = await api.put('/settings', data);
      return res.data as Settings;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
    onError,
  });
}
