export type Role = 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PayslipStatus = 'DRAFT' | 'APPROVED' | 'PAID';
export type DocumentType = 'EMPLOYMENT_CONTRACT' | 'HIRE_ORDER' | 'LEAVE_ORDER' | 'CERTIFICATE';
export type NotificationType = 'LEAVE_REQUEST' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'PAYSLIP_READY' | 'DOCUMENT_GENERATED' | 'WELCOME';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
