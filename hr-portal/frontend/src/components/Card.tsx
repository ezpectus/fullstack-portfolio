import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className, hover = false, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn('rounded-xl border p-6 shadow-sm', className)}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

export function StatCard({ label, value, icon, color = 'var(--color-primary)', trend, delay = 0 }: StatCardProps) {
  return (
    <Card hover delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="mt-2 text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {value}
          </motion.p>
          {trend && (
            <p className="mt-1 text-xs" style={{ color: trend.positive ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {trend.positive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
