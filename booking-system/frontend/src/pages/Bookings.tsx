import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import { useToastStore } from '../store/toastStore';
import { ErrorState } from '../components/ui/EmptyState';
import { formatDate, formatTime, formatCurrency, getStatusColor } from '../lib/utils';
import type { Booking, BookingStatus, PaginatedResponse, Service, Customer, Provider } from '../types';

const statusOptions: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function Bookings() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showCreate, setShowCreate] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', page, limit, debouncedSearch, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: String(limit) };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/bookings', { params });
      return res.data as PaginatedResponse<Booking>;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      await api.patch(`/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      addToast('Booking status updated');
    },
    onError: () => addToast('Failed to update booking status'),
  });

  if (isError) return <ErrorState message="Failed to load bookings" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings</h2>
          <p className="text-sm text-muted-foreground">Manage all bookings</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> New Booking
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search by booking number or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking #</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Provider</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-border">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-muted" /></td>
                  ))}
                </tr>
              ))
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No bookings found</td>
              </tr>
            ) : (
              <AnimatePresence>
                {data?.data?.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{booking.bookingNumber}</td>
                    <td className="px-4 py-3">{booking.service?.name || '—'}</td>
                    <td className="px-4 py-3">{booking.customer?.name || '—'}</td>
                    <td className="px-4 py-3">{booking.provider?.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs">
                      {formatDate(booking.startTime)}<br />
                      <span className="text-muted-foreground">{formatTime(booking.startTime)}</span>
                    </td>
                    <td className="px-4 py-3">{formatCurrency(booking.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus.mutate({ id: booking.id, status: e.target.value as BookingStatus })}
                        className="rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border p-2 disabled:opacity-50 hover:bg-muted"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="rounded-lg border border-border p-2 disabled:opacity-50 hover:bg-muted"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateBookingModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}

function CreateBookingModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [form, setForm] = useState({ serviceId: '', providerId: '', customerId: '', startTime: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const { data: services } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: async () => (await api.get('/services', { params: { limit: '100' } })).data.data,
  });
  const { data: customers } = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: async () => (await api.get('/customers', { params: { limit: '100' } })).data.data,
  });
  const { data: providers } = useQuery({
    queryKey: ['providers', 'all', form.serviceId],
    queryFn: async () => {
      const params: Record<string, string> = { limit: '100' };
      if (form.serviceId) params.serviceId = form.serviceId;
      return (await api.get('/providers', { params })).data.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      addToast('Booking created successfully');
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      addToast(error.response?.data?.error?.message || 'Failed to create booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">New Booking</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value, providerId: '' })}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Select Service</option>
            {services?.map((s: Service) => <option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</option>)}
          </select>
          <select
            value={form.providerId}
            onChange={(e) => setForm({ ...form, providerId: e.target.value })}
            required
            disabled={!form.serviceId}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">{form.serviceId ? 'Select Provider' : 'Select a service first'}</option>
            {providers?.map((p: Provider) => <option key={p.id} value={p.id}>{p.user?.name || 'Unknown'}</option>)}
          </select>
          <select
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Select Customer</option>
            {customers?.map((c: Customer) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
          </select>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
