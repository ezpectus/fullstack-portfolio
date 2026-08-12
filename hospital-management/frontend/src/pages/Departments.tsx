import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, MapPin, Plus, Pencil, Trash2, Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useDoctors } from '../lib/hooks';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useDebounce } from '../hooks/useDebounce';
import type { Department } from '../types';

interface FormData {
  name: string;
  description: string;
  phone: string;
  location: string;
  headDoctorId: string;
}

const emptyForm: FormData = { name: '', description: '', phone: '', location: '', headDoctorId: '' };

export default function Departments() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'RECEPTIONIST';
  const canDelete = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const debouncedSearch = useDebounce(search, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const { data, isLoading, isError, refetch } = useDepartments({ page, limit, search: debouncedSearch || undefined });
  const { data: doctorsData } = useDoctors({ page: 1, limit: 100 });

  const createMut = useCreateDepartment();
  const updateMut = useUpdateDepartment();
  const deleteMut = useDeleteDepartment();

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({
      name: dept.name,
      description: dept.description || '',
      phone: dept.phone || '',
      location: dept.location || '',
      headDoctorId: dept.headDoctorId || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload: Record<string, any> = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      phone: form.phone.trim() || undefined,
      location: form.location.trim() || undefined,
      headDoctorId: form.headDoctorId || undefined,
    };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, ...payload });
        addToast('success', 'Department updated successfully');
      } else {
        await createMut.mutateAsync(payload);
        addToast('success', 'Department created successfully');
      }
      setModalOpen(false);
    } catch (err: any) {
      addToast('error', err?.response?.data?.error?.message || 'Failed to save department');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget.id);
      addToast('success', 'Department deleted successfully');
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', err?.response?.data?.error?.message || 'Failed to delete department');
    }
  };

  const doctorOptions = [
    { value: '', label: '— No head doctor —' },
    ...(doctorsData?.items?.map((d: any) => ({ value: d.id, label: d.user.name })) || []),
  ];

  const items = data?.items || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  if (isError) return <ErrorState message="Failed to load departments" onRetry={() => refetch()} />;
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
          />
        </div>
        {canManage && (
          <Button onClick={openCreate} size="md">
            <Plus size={18} className="mr-1.5" />
            Add Department
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No departments found"
          description={search ? "Try a different search term" : "Add departments to organize your hospital"}
          action={canManage && !search ? <Button onClick={openCreate}><Plus size={18} className="mr-1.5" />Add Department</Button> : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((dept: Department, idx: number) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="text-teal-600" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                        {dept.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{dept.description}</p>}
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                          <Pencil size={16} />
                        </button>
                        {canDelete && (
                          <button onClick={() => setDeleteTarget(dept)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {dept.headDoctor && (
                      <p>Head: <span className="font-medium text-slate-800">{dept.headDoctor.user.name}</span></p>
                    )}
                    {dept.phone && (
                      <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {dept.phone}</p>
                    )}
                    {dept.location && (
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {dept.location}</p>
                    )}
                    {dept._count && (
                      <p className="flex items-center gap-2"><Users size={14} className="text-slate-400" /> {dept._count.doctors} doctor{dept._count.doctors !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-slate-600 px-2">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <div className="space-y-4">
          <Input
            label="Name *"
            placeholder="e.g. Cardiology"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <Textarea
            label="Description"
            placeholder="Brief description of the department"
            rows={3}
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone"
              placeholder="e.g. +1 234 567 890"
              value={form.phone}
              onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="Location"
              placeholder="e.g. Building A, Floor 3"
              value={form.location}
              onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
            />
          </div>
          <Select
            label="Head Doctor"
            options={doctorOptions}
            value={form.headDoctorId}
            onChange={(e) => setForm(f => ({ ...f, headDoctorId: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={createMut.isPending || updateMut.isPending} onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Department" size="sm">
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteTarget?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleteMut.isPending} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
