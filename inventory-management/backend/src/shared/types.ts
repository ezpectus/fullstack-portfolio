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
  type?: string;
  categoryId?: string;
  warehouseId?: string;
  supplierId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
