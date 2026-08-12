import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  setAuth: (user: User, accessToken: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  login: (user, token) => set({ user, accessToken: token }),
  logout: () => set({ user: null, accessToken: null }),
  isAuthenticated: () => !!get().accessToken,
  setAuth: (user, accessToken) => set({ user, accessToken }),
}));
