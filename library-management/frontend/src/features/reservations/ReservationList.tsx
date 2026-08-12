import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { reservationsApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { getStatusColor, formatDate } from '../../lib/utils';

export default function ReservationList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reservations', page, status],
    queryFn: () => reservationsApi.list({ page, limit: 20, status: status || undefined }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => reservationsApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to cancel reservation');
      console.error('Cancel reservation error:', error);
    },
  });

  if (isError) return <ErrorState message="Failed to load reservations" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Reservations</h1>
        <select className="input max-w-40" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
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
                  <th className="py-2">Book</th>
                  <th className="py-2">Member</th>
                  <th className="py-2">Reserved</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((res) => (
                  <StaggerItem key={res.id}>
                    <tr className="border-b border-cream-200">
                      <td className="py-3">{res.book?.title || 'N/A'}</td>
                      <td className="py-3">{res.member?.user?.name || 'N/A'}</td>
                      <td className="py-3 text-sm">{formatDate(res.reservedAt)}</td>
                      <td className="py-3"><span className={`badge ${getStatusColor(res.status)}`}>{res.status}</span></td>
                      <td className="py-3">
                        {res.status === 'PENDING' && (
                          <Button size="sm" variant="ghost" loading={cancelMutation.isPending} onClick={() => cancelMutation.mutate(res.id)}>
                            <X className="w-4 h-4" /> Cancel
                          </Button>
                        )}
                      </td>
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
