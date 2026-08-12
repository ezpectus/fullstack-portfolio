import api from './client';
import type { Client, PaginatedResponse, ClientBalance } from '../types';

export const clientsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }) => {
    const { data } = await api.get<PaginatedResponse<Client>>('/clients', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },
  getBalance: async (id: string) => {
    const { data } = await api.get<ClientBalance>(`/clients/${id}/balance`);
    return data;
  },
  create: async (payload: Partial<Client>) => {
    const { data } = await api.post<Client>('/clients', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Client>) => {
    const { data } = await api.patch<Client>(`/clients/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/clients/${id}`);
  },
};
