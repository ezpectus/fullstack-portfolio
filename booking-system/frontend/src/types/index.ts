export type Role = 'ADMIN' | 'PROVIDER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  categoryId?: string | null;
  category?: ServiceCategory;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  bio?: string;
  isActive: boolean;
  services?: Service[];
  workingHours?: WorkingHours[];
  createdAt: string;
}

export interface WorkingHours {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface TimeOff {
  id: string;
  providerId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  price: number;
  status: BookingStatus;
  notes?: string;
  cancelReason?: string;
  service?: Service;
  provider?: Provider;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  bookings?: Booking[];
  _count?: { bookings: number };
  createdAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface DashboardOverview {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCustomers: number;
  totalProviders: number;
  totalServices: number;
  totalRevenue: number;
}

export interface BookingsByDay {
  date: string;
  count: number;
  revenue: number;
}

export interface TopService {
  id: string;
  name: string;
  bookingCount: number;
  revenue: number;
}

export interface TopProvider {
  id: string;
  name: string;
  bookingCount: number;
  revenue: number;
}

export interface Settings {
  [key: string]: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
