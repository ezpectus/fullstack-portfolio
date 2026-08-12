import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Wallet,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  Moon,
  Sun,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useQueryClient } from '@tanstack/react-query';
import { cn, getInitials } from '../lib/utils';
import { useEffect } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', label: 'Employees', icon: Users, roles: ['HR_ADMIN', 'MANAGER'] },
  { to: '/departments', label: 'Departments', icon: Building2, roles: ['HR_ADMIN', 'MANAGER'] },
  { to: '/leave', label: 'Leave', icon: CalendarDays, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/payroll', label: 'Payroll', icon: Wallet, roles: ['HR_ADMIN'] },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['HR_ADMIN', 'MANAGER'] },
];

export default function Layout() {
  const prefersReduced = useReducedMotion();
  const { user, logout, initialize } = useAuthStore();
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    initialize();
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const visibleNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={prefersReduced ? { opacity: 0 } : { x: -280, opacity: 0 }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { x: -280, opacity: 0 }}
            transition={prefersReduced ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-50 w-[280px] flex flex-col"
            style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
                HR
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>HR Portal</h1>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Management System</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {visibleNavItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={prefersReduced ? { opacity: 0 } : { x: -20, opacity: 0 }}
                  animate={prefersReduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
                  transition={prefersReduced ? { duration: 0.2 } : { delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'text-white shadow-sm'
                          : 'hover:bg-opacity-80',
                      )
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                        : { color: 'var(--color-text-muted)' }
                    }
                  >
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="border-t px-3 py-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                  {user ? getInitials(user.name) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user?.role.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 transition-colors hover:bg-red-50"
                  style={{ color: 'var(--color-danger)' }}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="rounded-lg p-2 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              <Menu size={22} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative rounded-lg p-2 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-danger)' }} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
