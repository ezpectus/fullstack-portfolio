export type Role = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'UNKNOWN';
export type NotificationType = 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'MEDICAL_RECORD_UPDATED' | 'WELCOME';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  location?: string;
  headDoctorId?: string;
  headDoctor?: { user: { name: string } };
  _count?: { doctors: number };
}

export interface Doctor {
  id: string;
  userId: string;
  departmentId?: string;
  specialization: string;
  bio?: string;
  consultationFee: number;
  isActive: boolean;
  user: { id: string; name: string; email: string; phone?: string; avatar?: string };
  department?: { id: string; name: string };
  _count?: { appointments: number };
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: Gender;
  address?: string;
  bloodType: BloodType;
  allergies?: string;
  chronicConditions?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
  primaryDoctorId?: string;
  user: { id: string; name: string; email: string; phone?: string; avatar?: string };
  primaryDoctor?: { user: { name: string } };
  _count?: { appointments: number; medicalRecords: number };
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  doctor: { user: { name: string }; department?: { name: string } };
  patient: { user: { name: string; phone?: string } };
  medicalRecord?: { id: string };
}

export interface MedicalRecord {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  complaints?: string;
  examination?: string;
  diagnosis?: string;
  prescriptions?: string;
  epicrisis?: string;
  attachments: string[];
  createdAt: string;
  appointment?: { id: string; startTime: string; endTime: string; status: string };
  patient?: { id: string; user: { name: string } };
  doctor?: { id: string; user: { name: string }; specialization: string };
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  appointmentId?: string;
  createdAt: string;
}

export interface WorkingHours {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface TimeOff {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface DoctorService {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface DashboardOverview {
  totalPatients: number;
  totalDoctors: number;
  totalDepartments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PageMeta;
}
