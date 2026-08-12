import { ReactNode } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mt-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-sm text-primary hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
