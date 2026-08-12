import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: { id: string; email: string; name: string; role: string } | null;
  setAuth: (data: { accessToken: string; user: { id: string; email: string; name: string; role: string } }) => void;
  updateUser: (data: Partial<{ id: string; email: string; name: string; role: string }>) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  setAuth: (data) => set({ accessToken: data.accessToken, user: data.user }),
  updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  logout: () => set({ accessToken: null, user: null }),
  isAuthenticated: () => !!get().accessToken,
}));
