import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setAuth: (user: User, accessToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => {
    set({ user: null, isAuthenticated: false, accessToken: null });
  },
  setAuth: (user, accessToken) => {
    set({ user, accessToken, isAuthenticated: true });
  },
}));
