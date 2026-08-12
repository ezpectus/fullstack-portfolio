import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarCheck, DollarSign, Users, TrendingUp, Clock, XCircle } from 'lucide-react';
import api from '../lib/api';
import { ErrorState } from '../components/ui/EmptyState';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../lib/utils';
import type { Booking } from '../types';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const res = await api.get('/dashboard/overview');
      return res.data.data;
    },
  });

  const { data: upcoming } = useQuery({
    queryKey: ['dashboard', 'upcoming'],
    queryFn: async () => {
      const res = await api.get('/dashboard/upcoming');
      return res.data.data;
    },
  });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;

  const stats = [
    { label: 'Total Bookings', value: data?.totalBookings ?? 0, icon: CalendarCheck, color: 'text-primary' },
    { label: 'Revenue', value: formatCurrency(data?.totalRevenue ?? 0), icon: DollarSign, color: 'text-green-500' },
    { label: 'Customers', value: data?.totalCustomers ?? 0, icon: Users, color: 'text-blue-500' },
    { label: 'Providers', value: data?.totalProviders ?? 0, icon: TrendingUp, color: 'text-accent' },
  ];

  const statusStats = [
    { label: 'Pending', value: data?.pendingBookings ?? 0, icon: Clock, color: 'text-amber-500' },
    { label: 'Confirmed', value: data?.confirmedBookings ?? 0, icon: CalendarCheck, color: 'text-blue-500' },
    { label: 'Completed', value: data?.completedBookings ?? 0, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Cancelled', value: data?.cancelledBookings ?? 0, icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of your booking system</p>
      </div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-2xl font-bold"
                >
                  {isLoading ? '—' : stat.value}
                </motion.p>
              </div>
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusStats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <stat.icon size={18} className={stat.color} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold">{isLoading ? '—' : stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold">Upcoming Bookings</h3>
          <div className="space-y-3">
            {isLoading || !upcoming ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))
            ) : upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No upcoming bookings</p>
            ) : (
              upcoming.slice(0, 5).map((booking: Booking, i: number) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CalendarCheck size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.service?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customer?.name} · {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold">Booking Status Breakdown</h3>
          <div className="space-y-3">
            {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((status) => {
              const count = data ? (
                status === 'PENDING' ? data.pendingBookings :
                status === 'CONFIRMED' ? data.confirmedBookings :
                status === 'COMPLETED' ? data.completedBookings :
                status === 'CANCELLED' ? data.cancelledBookings : 0
              ) : 0;
              const total = data?.totalBookings || 1;
              const pct = (count / total) * 100;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${getStatusColor(status).split(' ')[0]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
