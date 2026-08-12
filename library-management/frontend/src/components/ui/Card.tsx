import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-cream-200 p-6', className)}>
    {children}
  </div>
);

export const Badge = ({ status, children }: { status?: string; children: React.ReactNode }) => {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-800',
    BORROWED: 'bg-blue-100 text-blue-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',
    LOST: 'bg-red-100 text-red-800',
    DAMAGED: 'bg-orange-100 text-orange-800',
    ACTIVE: 'bg-green-100 text-green-800',
    RETURNED: 'bg-gray-100 text-gray-800',
    OVERDUE: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FULFILLED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    EXPIRED: 'bg-red-100 text-red-800',
    PAID: 'bg-green-100 text-green-800',
    WAIVED: 'bg-purple-100 text-purple-800',
    SUSPENDED: 'bg-red-100 text-red-800',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[status || ''] || 'bg-gray-100 text-gray-800')}>
      {children}
    </span>
  );
};

export const EmptyState = ({ title, message, action }: { title: string; message?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-cream-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
    <h3 className="text-lg font-serif text-gray-700 mb-1">{title}</h3>
    {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}
    {action}
  </div>
);

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-cream-200 rounded-lg ${className}`} />
);
