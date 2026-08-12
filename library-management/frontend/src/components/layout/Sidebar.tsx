import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useLogout';
import { BookOpen, LayoutDashboard, BookMarked, Users, ArrowLeftRight, CalendarClock, DollarSign, BarChart3, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/books', label: 'Books', icon: BookMarked, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/book-copies', label: 'Book Copies', icon: BookOpen, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/members', label: 'Members', icon: Users, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/loans', label: 'Loans', icon: ArrowLeftRight, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/reservations', label: 'Reservations', icon: CalendarClock, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
  { to: '/fines', label: 'Fines', icon: DollarSign, roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN', 'LIBRARIAN'] },
];

export const Sidebar = () => {
  const { user } = useAuthStore();
  const handleLogout = useLogout();

  return (
    <aside className="w-64 bg-cream-50 border-r border-cream-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-cream-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="font-serif text-lg text-gray-800">Library</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.filter((item) => item.roles.includes(user?.role ?? 'MEMBER')).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-cream-100',
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-cream-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
            <span className="font-serif text-amber-800">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-cream-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </aside>
  );
};
