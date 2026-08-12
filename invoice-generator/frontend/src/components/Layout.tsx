import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useLogout } from '../hooks/useLogout';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, FilePlus, LayoutTemplate, Sun, Moon } from 'lucide-react';
import { ToastContainer } from './animations/MotionComponents';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ACCOUNTANT', 'VIEWER'] },
  { to: '/invoices', label: 'Invoices', icon: FileText, roles: ['OWNER', 'ACCOUNTANT', 'VIEWER'] },
  { to: '/invoices/new', label: 'Create Invoice', icon: FilePlus, roles: ['OWNER', 'ACCOUNTANT'] },
  { to: '/clients', label: 'Clients', icon: Users, roles: ['OWNER', 'ACCOUNTANT'] },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate, roles: ['OWNER', 'ACCOUNTANT'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['OWNER', 'ACCOUNTANT'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['OWNER'] },
];

export default function Layout() {
  const { user } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary-600">InvoiceGen</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.filter((item) => item.roles.includes(user?.role ?? 'VIEWER')).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
