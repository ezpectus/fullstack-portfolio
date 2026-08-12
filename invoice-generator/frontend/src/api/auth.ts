import api from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  me: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
