import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CalendarDays, Check, X } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import { formatDate, getInitials } from '../lib/utils';
import type { LeaveRequest, LeaveTypeModel, PaginatedResponse } from '../types';

export default function Leave() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<LeaveRequest>>({
    queryKey: ['leave', page, statusFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      return (await api.get('/leave', { params })).data;
    },
  });

  const { data: leaveTypes } = useQuery<LeaveTypeModel[]>({
    queryKey: ['leave-types'],
    queryFn: async () => (await api.get('/leave/types')).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: { leaveType: string; startDate: string; endDate: string; comment?: string }) =>
      api.post('/leave', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast('success', 'Leave request submitted');
      setShowForm(false);
      setLeaveType('ANNUAL'); setStartDate(''); setEndDate(''); setComment('');
    },
    onError: () => toast('error', 'Failed to submit leave request'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/leave/${id}/approve`, { status: 'APPROVED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast('success', 'Leave approved');
      setApproveId(null); setRejectReason('');
    },
    onError: () => toast('error', 'Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { id: string; rejectionReason: string }) =>
      api.post(`/leave/${data.id}/approve`, { status: 'REJECTED', rejectionReason: data.rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast('success', 'Leave rejected');
      setApproveId(null); setRejectReason('');
    },
    onError: () => toast('error', 'Failed to reject'),
  });

  const canApprove = user?.role === 'HR_ADMIN' || user?.role === 'MANAGER';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ leaveType, startDate, endDate, comment: comment || undefined });
  };

  return (
    <div>
      <PageHeader
        title="Leave Management"
        description="Manage leave requests"
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> Request Leave</button>}
      />

      <Card className="mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input sm:w-48">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </Card>

      <Card>
        {isError ? (
          <ErrorState message="Failed to load leave requests" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} lines={2} />)}</div>
        ) : data && data.items.length > 0 ? (
          <div className="space-y-3">
            {data.items.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-lg p-4 border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                    {getInitials(`${req.employee.firstName} ${req.employee.lastName}`)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {req.employee.firstName} {req.employee.lastName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {req.leaveType.name} • {formatDate(req.startDate)} - {formatDate(req.endDate)} • {req.days} days
                    </p>
                    {req.comment && <p className="text-xs mt-1 italic" style={{ color: 'var(--color-text-muted)' }}>"{req.comment}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={req.status} />
                  {canApprove && req.status === 'PENDING' && (
                    <div className="flex gap-1">
                      <button onClick={() => approveMutation.mutate(req.id)} className="rounded-lg p-2 hover:bg-green-50" style={{ color: 'var(--color-success)' }} title="Approve">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setApproveId(req.id)} className="rounded-lg p-2 hover:bg-red-50" style={{ color: 'var(--color-danger)' }} title="Reject">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Showing {data.items.length} of {data.total}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50">Previous</button>
                <button onClick={() => setPage(p => p + 1)} disabled={data.items.length < 10} className="btn-secondary disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={<CalendarDays size={32} />} title="No leave requests" description="Submit a new leave request to get started" />
        )}
      </Card>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Leave Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Leave Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="input">
              {(leaveTypes || []).map((lt) => <option key={lt.id} value={lt.name}>{lt.name} ({lt.defaultDays} days)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Comment (optional)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="input" placeholder="Add a comment..." />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!approveId} onClose={() => { setApproveId(null); setRejectReason(''); }} title="Reject Leave Request" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Rejection Reason</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="input" placeholder="Provide a reason..." />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setApproveId(null); setRejectReason(''); }} className="btn-secondary">Cancel</button>
            <button onClick={() => approveId && rejectMutation.mutate({ id: approveId, rejectionReason: rejectReason })} className="btn-danger" disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
