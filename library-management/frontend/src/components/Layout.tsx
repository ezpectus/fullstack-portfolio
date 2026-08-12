import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, LayoutDashboard, Library, Users, BookCopy, ArrowLeftRight, CalendarClock, DollarSign, BarChart3, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useLogout } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { ToastContainer } from './ui/Toast';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/books', label: 'Books', icon: Library, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/book-copies', label: 'Book Copies', icon: BookCopy, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/members', label: 'Members', icon: Users, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/loans', label: 'Loans', icon: ArrowLeftRight, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/reservations', label: 'Reservations', icon: CalendarClock, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/fines', label: 'Fines', icon: DollarSign, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN', 'LIBRARIAN'] },
];

export default function Layout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const logoutFn = useLogout();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore error, still logout locally
    }
    logoutFn();
    navigate('/login');
  };

  const visibleItems = navItems.filter((item) => !user || item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-cream-100 dark:bg-gray-900">
      <aside className="w-64 bg-amber-800 text-cream-50 flex flex-col dark:bg-gray-800">
        <div className="p-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-xl font-serif font-semibold">Library MS</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-600 text-white' : 'text-cream-200 hover:bg-amber-700 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-amber-700 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-cream-200">
              {user?.name} ({user?.role})
            </div>
            <button
              onClick={toggleTheme}
              className="text-cream-200 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-cream-200 hover:text-white">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <ToastContainer />
    </div>
  );
}
