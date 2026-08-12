import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { toast } from '../components/Toast';

function mutationOnError(error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast('error', message);
}
import type {
  Employee,
  Department,
  LeaveRequest,
  Payslip,
  Document,
  DashboardStats,
  PaginatedResponse,
  LeaveBalance,
  SalaryFundItem,
} from '../types';

// Dashboard
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });
}

export function useDashboardTrends(months = 6) {
  return useQuery({
    queryKey: ['dashboard', 'trends', months],
    queryFn: async () => (await api.get(`/dashboard/trends?months=${months}`)).data,
  });
}

export function useSalaryFund() {
  return useQuery<SalaryFundItem[]>({
    queryKey: ['dashboard', 'salary-fund'],
    queryFn: async () => (await api.get('/dashboard/salary-fund')).data,
  });
}

// Employees
export function useEmployees(params: { page?: number; limit?: number; search?: string; departmentId?: string; status?: string }) {
  return useQuery<PaginatedResponse<Employee>>({
    queryKey: ['employees', params],
    queryFn: async () => (await api.get('/employees', { params })).data,
  });
}

export function useEmployee(id: string) {
  return useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: async () => (await api.get(`/employees/${id}`)).data,
    enabled: !!id,
  });
}

export function useOrgStructure() {
  return useQuery({
    queryKey: ['employees', 'org-structure'],
    queryFn: async () => (await api.get('/employees/org-structure')).data,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => (await api.post('/employees', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    onError: mutationOnError,
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      (await api.patch(`/employees/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    onError: mutationOnError,
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/employees/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    onError: mutationOnError,
  });
}

// Departments
export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => (await api.post('/departments', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
    onError: mutationOnError,
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      (await api.patch(`/departments/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
    onError: mutationOnError,
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/departments/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
    onError: mutationOnError,
  });
}

// Leave
export function useLeaveRequests(params: { page?: number; limit?: number; status?: string; employeeId?: string }) {
  return useQuery<PaginatedResponse<LeaveRequest>>({
    queryKey: ['leave', params],
    queryFn: async () => (await api.get('/leave', { params })).data,
  });
}

export function useLeaveBalance(employeeId?: string) {
  return useQuery<LeaveBalance[]>({
    queryKey: ['leave', 'balance', employeeId],
    queryFn: async () => (await api.get(`/leave/balance${employeeId ? `?employeeId=${employeeId}` : ''}`)).data,
  });
}

export function useCreateLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => (await api.post('/leave', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
    onError: mutationOnError,
  });
}

export function useApproveLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      (await api.patch(`/leave/${id}/approve`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
    onError: mutationOnError,
  });
}

export function useRejectLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      (await api.patch(`/leave/${id}/reject`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
    onError: mutationOnError,
  });
}

// Payroll
export function usePayslips(params: { page?: number; limit?: number; employeeId?: string; status?: string; month?: number; year?: number }) {
  return useQuery<PaginatedResponse<Payslip>>({
    queryKey: ['payroll', params],
    queryFn: async () => (await api.get('/payroll', { params })).data,
  });
}

export function useCreatePayslip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => (await api.post('/payroll', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll'] }),
    onError: mutationOnError,
  });
}

export function useApprovePayslip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.patch(`/payroll/${id}/approve`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll'] }),
    onError: mutationOnError,
  });
}

export function usePayPayslip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.patch(`/payroll/${id}/pay`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll'] }),
    onError: mutationOnError,
  });
}

// Documents
export function useDocuments(params: { page?: number; limit?: number; employeeId?: string; type?: string }) {
  return useQuery<PaginatedResponse<Document>>({
    queryKey: ['documents', params],
    queryFn: async () => (await api.get('/documents', { params })).data,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => (await api.post('/documents', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    onError: mutationOnError,
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/documents/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    onError: mutationOnError,
  });
}

// Reports
export function useHeadcountReport() {
  return useQuery({
    queryKey: ['reports', 'headcount'],
    queryFn: async () => (await api.get('/reports/headcount')).data,
  });
}

export function usePayrollReport(month?: number, year?: number) {
  return useQuery({
    queryKey: ['reports', 'payroll', month, year],
    queryFn: async () => (await api.get('/reports/payroll', { params: { month, year } })).data,
  });
}

export function useLeaveReport() {
  return useQuery({
    queryKey: ['reports', 'leave'],
    queryFn: async () => (await api.get('/reports/leave')).data,
  });
}

export function useExportCSV(type: string) {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get(`/reports/export?type=${type}`, { responseType: 'blob' });
      return res.data;
    },
    onError: mutationOnError,
  });
}
