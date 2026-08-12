import { motion, useReducedMotion } from 'framer-motion';
import { cn, getStatusColor } from '../lib/utils';

interface BadgeProps {
  status: string;
  label?: string;
}

export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={cn('badge', getStatusColor(status))}>
      {label || status.replace(/_/g, ' ').toLowerCase()}
    </span>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton h-4" style={{ width: `${100 - i * 10}%` }} />
        ))}
      </div>
    );
  }
  return <div className={cn('skeleton h-4', className)} />;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {description && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      className="mb-6 flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{title}</h1>
        {description && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
