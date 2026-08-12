import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Wallet, Check } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { formatCurrency, getInitials } from '../lib/utils';
import type { Payslip, PaginatedResponse } from '../types';

export default function Payroll() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [baseSalary, setBaseSalary] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Payslip>>({
    queryKey: ['payroll', page, statusFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      return (await api.get('/payroll', { params })).data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { employeeId: string; month: number; year: number; baseSalary: number; bonus: number; allowances: number; deductions: number }) =>
      api.post('/payroll', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast('success', 'Payslip created');
      setShowForm(false);
      setEmployeeId(''); setBaseSalary(0); setBonus(0); setAllowances(0); setDeductions(0);
    },
    onError: () => toast('error', 'Failed to create payslip'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/payroll/${id}/approve`, { status: 'APPROVED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast('success', 'Payslip approved');
    },
    onError: () => toast('error', 'Failed to approve payslip'),
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => api.post(`/payroll/${id}/pay`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast('success', 'Payslip marked as paid');
    },
    onError: () => toast('error', 'Failed to mark as paid'),
  });

  const total = baseSalary + bonus + allowances - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ employeeId, month, year, baseSalary, bonus, allowances, deductions });
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Manage employee payslips"
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> New Payslip</button>}
      />

      <Card className="mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input sm:w-48">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option>
        </select>
      </Card>

      <Card>
        {isError ? (
          <ErrorState message="Failed to load payroll data" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} lines={2} />)}</div>
        ) : data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Employee</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Period</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Base</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Bonus</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Total</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Status</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                          {getInitials(`${p.employee.firstName} ${p.employee.lastName}`)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{p.employee.firstName} {p.employee.lastName}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.employee.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{p.month}/{p.year}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{formatCurrency(p.baseSalary)}</td>
                    <td className="py-3 px-2 text-sm" style={{ color: 'var(--color-text)' }}>{formatCurrency(p.bonus)}</td>
                    <td className="py-3 px-2 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(p.total)}</td>
                    <td className="py-3 px-2"><Badge status={p.status} /></td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-2">
                        {p.status === 'DRAFT' && (
                          <button onClick={() => approveMutation.mutate(p.id)} className="btn-secondary text-xs" title="Approve">
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {p.status === 'APPROVED' && (
                          <button onClick={() => payMutation.mutate(p.id)} className="btn-primary text-xs" title="Mark Paid">
                            <Wallet size={14} /> Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Showing {data.items.length} of {data.total}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50">Previous</button>
                <button onClick={() => setPage(p => p + 1)} disabled={data.items.length < 10} className="btn-secondary disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={<Wallet size={32} />} title="No payslips" description="Create a new payslip to get started" />
        )}
      </Card>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Payslip">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Employee ID</label>
            <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className="input" placeholder="Enter employee ID" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input">
                {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Year</label>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Base Salary</label>
              <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Bonus</label>
              <input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Allowances</label>
              <input type="number" value={allowances} onChange={(e) => setAllowances(Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Deductions</label>
              <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="input" />
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-background)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Total: <strong style={{ color: 'var(--color-text)' }}>{formatCurrency(total)}</strong></p>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
