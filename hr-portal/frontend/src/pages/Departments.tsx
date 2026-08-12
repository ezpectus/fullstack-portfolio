import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, Trash2, Edit2 } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import type { Department } from '../types';

export default function Departments() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: departments, isLoading, isError, refetch } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) => api.post('/departments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast('success', 'Department created');
      setShowForm(false);
      setName(''); setDescription('');
    },
    onError: () => toast('error', 'Failed to create department'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; description?: string }) => api.put(`/departments/${data.id}`, { name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast('success', 'Department updated');
      setShowForm(false); setEditing(null);
      setName(''); setDescription('');
    },
    onError: () => toast('error', 'Failed to update department'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast('success', 'Department deleted');
      setDeleteId(null);
    },
    onError: () => toast('error', 'Failed to delete department'),
  });

  const canManage = user?.role === 'HR_ADMIN';

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setName(dept.name);
    setDescription(dept.description || '');
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, name, description });
    } else {
      createMutation.mutate({ name, description });
    }
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Organizational structure"
        action={canManage && <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Department</button>}
      />

      {isError ? (
        <ErrorState message="Failed to load departments" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Card key={i}><Skeleton lines={3} /></Card>)}
        </div>
      ) : departments && departments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <Card key={dept.id} hover delay={i * 0.05}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--color-primary)15', color: 'var(--color-primary)' }}>
                  <Building2 size={24} />
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(dept)} className="rounded-lg p-2 hover:bg-black/5" style={{ color: 'var(--color-text-muted)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteId(dept.id)} className="rounded-lg p-2 hover:bg-red-50" style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{dept.name}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{dept.description || 'No description'}</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge status="ACTIVE" label={`${dept._count?.employees ?? 0} employees`} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<Building2 size={32} />} title="No departments" description="Create your first department" /></Card>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Department' : 'New Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="e.g. Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input" placeholder="Department description..." />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Department" size="sm">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text)' }}>Are you sure you want to delete this department?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="btn-danger">
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
