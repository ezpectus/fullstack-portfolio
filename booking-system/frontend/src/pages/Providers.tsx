import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, X, Mail, Clock } from 'lucide-react';
import api from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import { useToastStore } from '../store/toastStore';
import { ErrorState } from '../components/ui/EmptyState';
import type { Provider, PaginatedResponse } from '../types';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Providers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['providers', page, debouncedSearch],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: '12' };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await api.get('/providers', { params });
      return res.data as PaginatedResponse<Provider>;
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/providers/${id}`, { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      addToast('Provider updated');
    },
  });

  if (isError) return <ErrorState message="Failed to load providers" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Providers</h2>
          <p className="text-sm text-muted-foreground">Manage service providers</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> Add Provider
        </motion.button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />)
        ) : data?.data?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">No providers found</div>
        ) : (
          <AnimatePresence>
            {data?.data?.map((provider, i) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
                    {provider.user?.name?.[0] || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{provider.user?.name || 'Unknown'}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail size={12} /> {provider.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActive.mutate({ id: provider.id, isActive: provider.isActive })}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${provider.isActive ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}
                  >
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {provider.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{provider.bio}</p>}

                {provider.workingHours && provider.workingHours.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Clock size={12} /> Working Hours
                    </p>
                    {provider.workingHours.filter((wh) => !wh.isBreak).slice(0, 3).map((wh) => (
                      <p key={wh.id} className="text-xs text-muted-foreground">
                        {days[wh.dayOfWeek]}: {wh.startTime} — {wh.endTime}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setEditing(provider); setShowForm(true); }}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    <Edit size={12} /> Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {showForm && <ProviderFormModal provider={editing} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ProviderFormModal({ provider, onClose }: { provider: Provider | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [form, setForm] = useState({ bio: provider?.bio || '', isActive: provider?.isActive ?? true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (provider) {
        await api.patch(`/providers/${provider.id}`, form);
        addToast('Provider updated');
      }
      queryClient.invalidateQueries({ queryKey: ['providers'] });
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
          <h3 className="text-lg font-semibold">Edit Provider</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
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
            {loading ? 'Saving...' : 'Update Provider'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
