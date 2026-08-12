export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RequestQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  providerId?: string;
  serviceId?: string;
  customerId?: string;
  categoryId?: string;
  isActive?: string;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
