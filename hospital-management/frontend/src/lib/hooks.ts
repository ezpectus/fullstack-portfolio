import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { PaginatedResponse } from '../types';

export function useDoctors(params: { page?: number; limit?: number; search?: string; departmentId?: string }) {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const { data } = await api.get('/doctors', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data } = await api.get(`/doctors/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await api.post('/doctors', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data } = await api.patch(`/doctors/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  });
}

export function useDeleteDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/doctors/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  });
}

export function usePatients(params: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const { data } = await api.get('/patients', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data } = await api.get(`/patients/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await api.post('/patients', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data } = await api.patch(`/patients/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useAppointments(params: { page?: number; limit?: number; doctorId?: string; patientId?: string; status?: string; date?: string }) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const { data } = await api.get('/appointments', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await api.post('/appointments', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data } = await api.patch(`/appointments/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useDepartments(params: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: async () => {
      const { data } = await api.get('/departments', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await api.post('/departments', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data } = await api.patch(`/departments/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useMedicalRecords(params: { page?: number; limit?: number; patientId?: string; doctorId?: string }) {
  return useQuery({
    queryKey: ['medical-records', params],
    queryFn: async () => {
      const { data } = await api.get('/medical-records', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function useCreateMedicalRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await api.post('/medical-records', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical-records'] }),
  });
}

export function useUpdateMedicalRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data } = await api.patch(`/medical-records/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical-records'] }),
  });
}

export function useDeleteMedicalRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/medical-records/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical-records'] }),
  });
}

export function useWorkingHours(doctorId: string) {
  return useQuery({
    queryKey: ['working-hours', doctorId],
    queryFn: async () => {
      const { data } = await api.get(`/schedule/${doctorId}/working-hours`);
      return data;
    },
    enabled: !!doctorId,
  });
}

export function useTimeOff(doctorId: string) {
  return useQuery({
    queryKey: ['time-off', doctorId],
    queryFn: async () => {
      const { data } = await api.get(`/schedule/${doctorId}/time-off`);
      return data;
    },
    enabled: !!doctorId,
  });
}

export function useDoctorServices(doctorId: string) {
  return useQuery({
    queryKey: ['doctor-services', doctorId],
    queryFn: async () => {
      const { data } = await api.get(`/schedule/${doctorId}/services`);
      return data;
    },
    enabled: !!doctorId,
  });
}

export function useNotifications(params: { page?: number; limit?: number; isRead?: boolean }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const { data } = await api.get('/notifications', { params });
      return data as PaginatedResponse<any>;
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/unread-count');
      return data.count as number;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/mark-all-read');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useAppointmentReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['report-appointments', params],
    queryFn: async () => {
      const { data } = await api.get('/reports/appointments', { params });
      return data;
    },
  });
}

export function usePatientReport() {
  return useQuery({
    queryKey: ['report-patients'],
    queryFn: async () => {
      const { data } = await api.get('/reports/patients');
      return data;
    },
  });
}

export function useDoctorReport() {
  return useQuery({
    queryKey: ['report-doctors'],
    queryFn: async () => {
      const { data } = await api.get('/reports/doctors');
      return data;
    },
  });
}

export function useRevenueReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['report-revenue', params],
    queryFn: async () => {
      const { data } = await api.get('/reports/revenue', { params });
      return data;
    },
  });
}
