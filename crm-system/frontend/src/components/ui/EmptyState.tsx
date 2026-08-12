import { type ReactNode } from 'react';
import { Users, FileText, TrendingUp, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: 'users' | 'deals' | 'notes' | 'default';
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const icons = {
  users: Users,
  deals: TrendingUp,
  notes: FileText,
  default: Inbox,
};

export function EmptyState({ icon = 'default', title, description, action, className }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = 'Something went wrong', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <span className="text-2xl">!</span>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-destructive">{message}</h3>
      <p className="mb-4 text-sm text-muted-foreground">Please try again</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
