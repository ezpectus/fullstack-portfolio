export type Role = 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PayslipStatus = 'DRAFT' | 'APPROVED' | 'PAID';
export type DocumentType = 'EMPLOYMENT_CONTRACT' | 'HIRE_ORDER' | 'LEAVE_ORDER' | 'CERTIFICATE';
export type NotificationType =
  | 'LEAVE_REQUEST'
  | 'LEAVE_APPROVED'
  | 'LEAVE_REJECTED'
  | 'PAYSLIP_READY'
  | 'DOCUMENT_GENERATED'
  | 'WELCOME';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  manager?: Employee;
  employees?: Employee[];
  _count?: { employees: number };
}

export interface Employee {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; role: Role; phone?: string; avatar?: string };
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  photo?: string;
  position: string;
  departmentId?: string;
  department?: Department;
  managerId?: string;
  manager?: Employee;
  subordinates?: Employee[];
  hireDate: string;
  terminationDate?: string;
  status: EmployeeStatus;
  education?: string;
  experience?: string;
  skills?: string;
  salary: number;
}

export interface LeaveTypeModel {
  id: string;
  name: LeaveType;
  defaultDays: number;
  carryForward: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: { user: { name: string; email: string }; department?: Department; firstName: string; lastName: string };
  leaveTypeId: string;
  leaveType: LeaveTypeModel;
  startDate: string;
  endDate: string;
  days: number;
  comment?: string;
  status: LeaveStatus;
  approvedById?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employee: { user: { name: string; email: string }; department?: Department; firstName: string; lastName: string; position: string };
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  allowances: number;
  deductions: number;
  total: number;
  status: PayslipStatus;
  approvedById?: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface Document {
  id: string;
  employeeId: string;
  employee: { user: { name: string }; firstName: string; lastName: string };
  type: DocumentType;
  title: string;
  fileUrl?: string;
  content?: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  totalPayslips: number;
  paidPayslips: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LeaveBalance {
  leaveType: LeaveType;
  defaultDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface SalaryFundItem {
  department: string;
  totalSalary: number;
  employeeCount: number;
}
