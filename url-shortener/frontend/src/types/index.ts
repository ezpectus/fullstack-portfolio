export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias: string | null;
  userId: string;
  expiresAt: string | null;
  password: string | null;
  status: 'active' | 'expired' | 'disabled' | 'archived';
  createdAt: string;
  updatedAt: string;
  _count?: { clicks: number };
}

export interface Click {
  id: string;
  shortLinkId: string;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  isUnique: boolean;
  createdAt: string;
}

export interface LinkAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  clicksByDay: { date: string; count: number }[];
  topCountries: { country: string; count: number }[];
  topDevices: { device: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
  topReferers: { referer: string; count: number }[];
}

export interface DashboardStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  clicksByDay: { date: string; count: number }[];
  topLinks: { id: string; shortCode: string; originalUrl: string; clicks: number }[];
  recentLinks: { id: string; shortCode: string; originalUrl: string; createdAt: string }[];
}

export interface ApiKey {
  id: string;
  userId: string;
  key: string;
  name: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  domain: string;
  codeLength: number;
  blacklist: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface CreateLinkInput {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
  password?: string;
}

export interface UpdateLinkInput {
  originalUrl?: string;
  alias?: string;
  expiresAt?: string;
  password?: string;
  status?: string;
}
