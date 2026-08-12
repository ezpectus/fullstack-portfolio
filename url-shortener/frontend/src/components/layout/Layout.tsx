import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useToastStore } from '../../store/toastStore';
import { useLogout } from '../../api/hooks';
import { ToastContainer } from '../animations/MotionComponents';
import { MotionButton } from '../animations/MotionComponents';
import { LayoutDashboard, Link2, BarChart3, QrCode, Settings, Key, LogOut, Moon, Sun, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/links', label: 'Links', icon: Link2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/qr', label: 'QR Codes', icon: QrCode },
  { to: '/api-keys', label: 'API Keys', icon: Key },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const { toasts, removeToast } = useToastStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (refreshToken) {
      logoutMutation.mutate(refreshToken, {
        onSettled: () => {
          logout();
          navigate('/login');
        },
      });
    } else {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 glass border-r border-white/10 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shadow-neon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">ShortURL</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/20 text-primary neon-text'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <MotionButton
              onClick={toggle}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </MotionButton>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
