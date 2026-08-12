import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  LayoutDashboard,
  Warehouse,
  ArrowLeftRight,
  Truck,
  ShoppingCart,
  FolderTree,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { ToastContainer } from '@/components/ui/Toast';
import { useLogout } from '@/hooks/useLogout';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  { to: '/products', label: 'Products', icon: Package, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  { to: '/categories', label: 'Categories', icon: FolderTree, roles: ['ADMIN', 'MANAGER'] },
  { to: '/warehouses', label: 'Warehouses', icon: Warehouse, roles: ['ADMIN', 'MANAGER'] },
  { to: '/stock-movements', label: 'Stock Movements', icon: ArrowLeftRight, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  { to: '/suppliers', label: 'Suppliers', icon: Truck, roles: ['ADMIN', 'MANAGER'] },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, roles: ['ADMIN', 'MANAGER'] },
];

export default function Layout() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const handleLogout = useLogout();

  const visibleItems = navItems.filter((item) => !user || item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">Inventory MS</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-300">
              {user?.name} ({user?.role})
            </div>
            <button
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
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
