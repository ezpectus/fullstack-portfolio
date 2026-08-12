import api from './client';
import type { AuthResponse, User, Company, Client, Invoice, Template, PaginatedResponse, DashboardStats, ClientBalance } from '../types';

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  refresh: () =>
    api.post<{ accessToken: string }>('/auth/refresh').then((r) => r.data),
  logout: () =>
    api.post('/auth/logout').then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

export const clientsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Client>>('/clients', { params }).then((r) => r.data),
  get: (id: string) => api.get<Client>(`/clients/${id}`).then((r) => r.data),
  getBalance: (id: string) => api.get<ClientBalance>(`/clients/${id}/balance`).then((r) => r.data),
  create: (data: Partial<Client>) => api.post<Client>('/clients', data).then((r) => r.data),
  update: (id: string, data: Partial<Client>) => api.patch<Client>(`/clients/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/clients/${id}`).then((r) => r.data),
};

export const companyApi = {
  get: () => api.get<Company>('/company').then((r) => r.data),
  update: (data: Partial<Company>) => api.patch<Company>('/company', data).then((r) => r.data),
};

export const invoicesApi = {
  list: (params?: { page?: number; limit?: number; search?: string; status?: string; clientId?: string }) =>
    api.get<PaginatedResponse<Invoice>>('/invoices', { params }).then((r) => r.data),
  get: (id: string) => api.get<Invoice>(`/invoices/${id}`).then((r) => r.data),
  create: (data: { clientId: string; dueDate: string; currency?: string; notes?: string; items: { description: string; quantity: number; unit: string; unitPrice: number; taxRate: number; discount: number }[] }) => api.post<Invoice>('/invoices', data).then((r) => r.data),
  update: (id: string, data: Partial<Invoice>) => api.patch<Invoice>(`/invoices/${id}`, data).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<Invoice>(`/invoices/${id}/status`, { status }).then((r) => r.data),
  delete: (id: string) => api.delete(`/invoices/${id}`).then((r) => r.data),
  downloadPdf: (id: string) =>
    api.get(`/pdf/${id}`, { responseType: 'blob' }).then((r) => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `invoice.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }),
  sendEmail: (id: string) => api.post(`/email/${id}/send`).then((r) => r.data),
};

export const templatesApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Template>>('/templates', { params }).then((r) => r.data),
  create: (data: Partial<Template>) => api.post<Template>('/templates', data).then((r) => r.data),
  update: (id: string, data: Partial<Template>) => api.patch<Template>(`/templates/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/templates/${id}`).then((r) => r.data),
};

export const reportsApi = {
  revenue: (params: { startDate: string; endDate: string }) =>
    api.get('/reports/revenue', { params }).then((r) => r.data),
  overdue: () => api.get('/reports/overdue').then((r) => r.data),
  topClients: (params: { startDate: string; endDate: string }) =>
    api.get('/reports/top-clients', { params }).then((r) => r.data),
};

export const dashboardApi = {
  stats: () => api.get<DashboardStats>('/dashboard').then((r) => r.data),
};
