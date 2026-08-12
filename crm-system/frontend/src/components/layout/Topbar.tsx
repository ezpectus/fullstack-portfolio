import { motion } from 'framer-motion';
import { Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import { useLogout } from '@/hooks/useLogout';

export default function Topbar() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const handleLogout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Welcome back, {user?.name?.split(' ')[0] ?? 'User'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.div>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {user ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
