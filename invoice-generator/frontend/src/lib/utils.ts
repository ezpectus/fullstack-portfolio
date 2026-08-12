import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    SENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    PAID: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
    OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    CANCELLED: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return colors[status] || colors.DRAFT;
}
