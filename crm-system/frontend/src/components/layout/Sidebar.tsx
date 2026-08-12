import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { LayoutDashboard, Users, KanbanSquare, StickyNote, Settings, Download, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  roles?: string[];
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/deals', label: 'Deals', icon: KanbanSquare },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/export', label: 'Export', icon: Download, roles: ['admin', 'manager'] },
  { to: '/users', label: 'Users', icon: UserCog, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const shouldReduceMotion = useReducedMotion();
  const user = useAuthStore((s) => s.user);

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          C
        </div>
        <span className="text-lg font-semibold">CRM System</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item, i) => (
          <motion.div
            key={item.to}
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05, duration: 0.2, ease: 'easeOut' }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
