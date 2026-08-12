import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    CONFIRMED: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    COMPLETED: 'bg-green-500/15 text-green-500 border-green-500/30',
    CANCELLED: 'bg-red-500/15 text-red-500 border-red-500/30',
    NO_SHOW: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  };
  return colors[status] || 'bg-gray-500/15 text-gray-500 border-gray-500/30';
}
