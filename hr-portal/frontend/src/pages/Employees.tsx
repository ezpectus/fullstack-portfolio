import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, Users } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import { formatDate, formatCurrency, getInitials } from '../lib/utils';
import type { Employee, PaginatedResponse } from '../types';

export default function Employees() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Employee>>({
    queryKey: ['employees', debouncedSearch, page, statusFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      return (await api.get('/employees', { params })).data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast('success', 'Employee deleted successfully');
      setDeleteId(null);
    },
    onError: () => toast('error', 'Failed to delete employee'),
  });

  const canManage = user?.role === 'HR_ADMIN';

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your organization's workforce"
        action={canManage && (
          <Link to="/employees/new" className="btn-primary">
            <Plus size={18} /> Add Employee
          </Link>
        )}
      />

      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input sm:w-48"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>
      </Card>

      <Card>
        {isError ? (
          <ErrorState message="Failed to load employees" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} lines={2} />)}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Employee</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Position</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Department</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Hire Date</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Salary</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Status</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((emp, i) => (
                  <tr key={emp.id} className="border-b" style={{ borderColor: 'var(--color-border)', animationDelay: `${i * 50}ms` }}>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                          {getInitials(`${emp.firstName} ${emp.lastName}`)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{emp.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{emp.position}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{emp.department?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{formatDate(emp.hireDate)}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{formatCurrency(emp.salary)}</td>
                    <td className="py-3 px-2"><Badge status={emp.status} /></td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-2">
                        <Link to={`/employees/${emp.id}`} className="rounded-lg p-2 transition-colors hover:bg-black/5" style={{ color: 'var(--color-primary)' }}>
                          <Eye size={16} />
                        </Link>
                        {canManage && (
                          <button onClick={() => setDeleteId(emp.id)} className="rounded-lg p-2 transition-colors hover:bg-red-50" style={{ color: 'var(--color-danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Showing {data.items.length} of {data.total} employees
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={data.items.length < 10}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Users size={32} />}
            title="No employees found"
            description="Try adjusting your search or filters"
          />
        )}
      </Card>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Employee" size="sm">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text)' }}>Are you sure you want to delete this employee? This action cannot be undone.</p>
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
