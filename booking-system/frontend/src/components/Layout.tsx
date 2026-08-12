import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Scissors,
  Users,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { ToastContainer } from './ui/ToastContainer';
import { cn } from '../lib/utils';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PROVIDER'] },
  { to: '/bookings', label: 'Bookings', icon: CalendarDays, roles: ['ADMIN', 'PROVIDER'] },
  { to: '/calendar', label: 'Calendar', icon: CalendarRange, roles: ['ADMIN', 'PROVIDER'] },
  { to: '/services', label: 'Services', icon: Scissors, roles: ['ADMIN'] },
  { to: '/providers', label: 'Providers', icon: Users, roles: ['ADMIN'] },
  { to: '/customers', label: 'Customers', icon: UserCircle, roles: ['ADMIN', 'PROVIDER'] },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, roles: ['ADMIN'] },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    logout();
    queryClient.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            B
          </div>
          <span className="text-lg font-semibold">BookingHub</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.filter((item) => item.roles.includes(user?.role || 'PROVIDER')).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent text-sm font-semibold">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.role || 'ADMIN'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <h1 className="text-lg font-semibold">BookingHub</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
