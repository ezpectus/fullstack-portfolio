import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Clock, DollarSign } from 'lucide-react';
import api from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import { useToastStore } from '../store/toastStore';
import { ErrorState } from '../components/ui/EmptyState';
import { formatCurrency } from '../lib/utils';
import type { Service, PaginatedResponse } from '../types';

export default function Services() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['services', page, debouncedSearch],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: '12' };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await api.get('/services', { params });
      return res.data as PaginatedResponse<Service>;
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      addToast('Service deleted');
    },
  });

  if (isError) return <ErrorState message="Failed to load services" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-sm text-muted-foreground">Manage service offerings</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> Add Service
        </motion.button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))
        ) : data?.data?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">No services found</div>
        ) : (
          <AnimatePresence>
            {data?.data?.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.description}</p>}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${service.isActive ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} /> {service.duration}min
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <DollarSign size={14} /> {formatCurrency(service.price)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setEditing(service); setShowForm(true); }}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this service?')) deleteService.mutate(service.id); }}
                    className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ServiceFormModal
            service={editing}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceFormModal({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [form, setForm] = useState({
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration?.toString() || '60',
    price: service?.price?.toString() || '0',
    isActive: service?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        duration: parseInt(form.duration),
        price: parseFloat(form.price),
        isActive: form.isActive,
      };
      if (service) {
        await api.patch(`/services/${service.id}`, payload);
        addToast('Service updated');
      } else {
        await api.post('/services', payload);
        addToast('Service created');
      }
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      addToast(error.response?.data?.error?.message || 'Failed', 'error');
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
          <h3 className="text-lg font-semibold">{service ? 'Edit Service' : 'New Service'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Duration (min)</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {[15, 30, 45, 60, 90, 120].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-border"
            />
            Active
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
