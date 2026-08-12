import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Mail, Phone } from 'lucide-react';
import { clientsApi } from '../../api/endpoints';
import { formatDate } from '../../lib/utils';
import { useDebounce } from '../../hooks';
import { useToastStore } from '../../store/toastStore';
import { Skeleton, AnimatedModal, StaggerContainer, StaggerItem } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';

export default function ClientList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', address: '', city: '', country: '', phone: '' });
  const qc = useQueryClient();
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['clients', page, debouncedSearch],
    queryFn: () => clientsApi.list({ page, limit: 10, search: debouncedSearch || undefined }),
  });

  if (isError) return <ErrorState message="Failed to load clients" onRetry={() => refetch()} />;

  const createMutation = useMutation({
    mutationFn: () => clientsApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); setShowCreate(false); setForm({ name: '', company: '', email: '', address: '', city: '', country: '', phone: '' }); },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to create client', 'error');
      console.error('Create client error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => clientsApi.delete(deleteId!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); setDeleteId(null); },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to delete client', 'error');
      console.error('Delete client error:', error);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Client</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input pl-10" placeholder="Search clients..." />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !data?.items?.length ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">No clients found</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Your First Client</button>
        </div>
      ) : (
        <>
          <StaggerContainer>
            <div className="space-y-2">
              {data.items.map((client) => (
                <StaggerItem key={client.id}>
                  <div className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <Link to={`/clients/${client.id}`} className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.company || client.email}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
                        {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>}
                        {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>}
                      </div>
                      <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{client._count?.invoices || 0} invoices</span>
                      <button onClick={() => setDeleteId(client.id)} className="btn-ghost text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">Prev</button>
              <span className="text-sm text-gray-500">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-secondary">Next</button>
            </div>
          )}
        </>
      )}

      <AnimatedModal isOpen={showCreate}>
        <h3 className="text-lg font-bold mb-4">Add Client</h3>
        <div className="space-y-3">
          <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
          <input placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
          </div>
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
          <button onClick={() => createMutation.mutate()} disabled={!form.name || !form.email || createMutation.isPending} className="btn-primary">
            {createMutation.isPending ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </AnimatedModal>

      <AnimatedModal isOpen={!!deleteId}>
        <h3 className="text-lg font-bold mb-2">Delete Client?</h3>
        <p className="text-sm text-gray-500 mb-4">This will also delete all related invoices.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => deleteMutation.mutate()} className="btn-danger">Delete</button>
        </div>
      </AnimatedModal>
    </div>
  );
}
