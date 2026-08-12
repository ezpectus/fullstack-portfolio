import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
  init: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  toggle: () => {
    const isDark = !get().isDark;
    localStorage.setItem('darkMode', String(isDark));
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDark });
  },
  setDark: (v) => {
    localStorage.setItem('darkMode', String(v));
    document.documentElement.classList.toggle('dark', v);
    set({ isDark: v });
  },
  init: () => {
    const stored = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', stored);
    set({ isDark: stored });
  },
}));
