import { api } from './client';
import type { AuthResponse, User, Book, BookCopy, Loan, Reservation, Fine, Member, DashboardStats, PaginatedResponse, BookInput, BookCopyInput, MemberInput } from '../types';

interface QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  memberId?: string;
  search?: string;
}

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};

export const booksApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<Book>>('/books', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Book>(`/books/${id}`).then((r) => r.data),
  create: (data: BookInput) => api.post<Book>('/books', data).then((r) => r.data),
  update: (id: string, data: Partial<BookInput>) => api.patch<Book>(`/books/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/books/${id}`),
};

export const bookCopiesApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<BookCopy>>('/book-copies', { params }).then((r) => r.data),
  getById: (id: string) => api.get<BookCopy>(`/book-copies/${id}`).then((r) => r.data),
  create: (data: BookCopyInput) => api.post<BookCopy>('/book-copies', data).then((r) => r.data),
  update: (id: string, data: Partial<BookCopyInput>) => api.patch<BookCopy>(`/book-copies/${id}`, data).then((r) => r.data),
};

export const membersApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<Member & { user: User }>>('/members', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Member & { user: User }>(`/members/${id}`).then((r) => r.data),
  update: (id: string, data: MemberInput) => api.patch<Member>(`/members/${id}`, data).then((r) => r.data),
  getLoans: (id: string) => api.get<Loan[]>(`/members/${id}/loans`).then((r) => r.data),
  getFines: (id: string) => api.get<Fine[]>(`/members/${id}/fines`).then((r) => r.data),
};

export const loansApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<Loan>>('/loans', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Loan>(`/loans/${id}`).then((r) => r.data),
  create: (data: { bookCopyId: string; memberId: string; dueDate?: string }) =>
    api.post<Loan>('/loans', data).then((r) => r.data),
  returnBook: (id: string) => api.patch<Loan>(`/loans/${id}/return`).then((r) => r.data),
  renew: (id: string) => api.patch<Loan>(`/loans/${id}/renew`).then((r) => r.data),
};

export const reservationsApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<Reservation>>('/reservations', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Reservation>(`/reservations/${id}`).then((r) => r.data),
  create: (data: { bookId: string }) =>
    api.post<Reservation>('/reservations', data).then((r) => r.data),
  cancel: (id: string) => api.patch<Reservation>(`/reservations/${id}/cancel`).then((r) => r.data),
};

export const finesApi = {
  list: (params?: QueryParams) =>
    api.get<PaginatedResponse<Fine>>('/fines', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Fine>(`/fines/${id}`).then((r) => r.data),
  pay: (id: string) => api.patch<Fine>(`/fines/${id}/pay`).then((r) => r.data),
  waive: (id: string) => api.patch<Fine>(`/fines/${id}/waive`).then((r) => r.data),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard').then((r) => r.data),
};

export const reportsApi = {
  memberActivity: (params?: QueryParams) => api.get('/reports/member-activity', { params }).then((r) => r.data),
  popularGenres: () => api.get('/reports/popular-genres').then((r) => r.data),
  lostDamaged: () => api.get('/reports/lost-damaged').then((r) => r.data),
  exportCsv: () => api.get('/reports/export', { responseType: 'blob' }).then((r) => r.data),
};
