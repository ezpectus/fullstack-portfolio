import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function getStatusColor(status: string): string {
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
    EXPIRED_MEMBER: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function daysUntil(date: string | Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
