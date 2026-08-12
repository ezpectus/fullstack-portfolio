import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  loadFromStorage: (user: User, accessToken: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => {
    set({ user, accessToken });
  },
  loadFromStorage: (user, accessToken) => {
    set({ user, accessToken });
  },
  updateUser: (user) => set({ user }),
  logout: () => {
    set({ user: null, accessToken: null });
  },
}));
