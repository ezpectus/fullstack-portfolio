import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Gift } from 'lucide-react';
import { finesApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { getStatusColor, formatCurrency, formatDate } from '../../lib/utils';

export default function FineList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['fines', page, status],
    queryFn: () => finesApi.list({ page, limit: 20, status: status || undefined }),
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => finesApi.pay(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fines'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to process payment');
      console.error('Pay fine error:', error);
    },
  });

  const waiveMutation = useMutation({
    mutationFn: (id: string) => finesApi.waive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fines'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to waive fine');
      console.error('Waive fine error:', error);
    },
  });

  if (isError) return <ErrorState message="Failed to load fines" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Fines</h1>
        <select className="input max-w-40" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="WAIVED">Waived</option>
        </select>
      </div>

      {isLoading ? (
        <SkeletonShimmer className="h-64" />
      ) : (
        <>
          <StaggerContainer>
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-300 text-left text-sm text-gray-500">
                  <th className="py-2">Member</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                  {canManage && <th className="py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((fine) => (
                  <StaggerItem key={fine.id}>
                    <tr className="border-b border-cream-200">
                      <td className="py-3">{fine.member?.user?.name || 'N/A'}</td>
                      <td className="py-3 font-medium">{formatCurrency(fine.amount)}</td>
                      <td className="py-3 text-sm text-gray-600">{fine.reason}</td>
                      <td className="py-3 text-sm">{formatDate(fine.createdAt)}</td>
                      <td className="py-3"><span className={`badge ${getStatusColor(fine.status)}`}>{fine.status}</span></td>
                      {canManage && fine.status === 'PENDING' && (
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="secondary" loading={payMutation.isPending} onClick={() => payMutation.mutate(fine.id)}>
                              <DollarSign className="w-4 h-4" /> Pay
                            </Button>
                            <Button size="sm" variant="ghost" loading={waiveMutation.isPending} onClick={() => waiveMutation.mutate(fine.id)}>
                              <Gift className="w-4 h-4" /> Waive
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  </StaggerItem>
                ))}
              </tbody>
            </table>
          </StaggerContainer>
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <span className="text-sm">Page {page} of {data.totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
