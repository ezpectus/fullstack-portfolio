import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RotateCcw, BookCheck } from 'lucide-react';
import { loansApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { getStatusColor, formatDate, daysUntil } from '../../lib/utils';

export default function LoanList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['loans', page, status],
    queryFn: () => loansApi.list({ page, limit: 20, status: status || undefined }),
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => loansApi.returnBook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loans'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to return book');
      console.error('Return book error:', error);
    },
  });

  const renewMutation = useMutation({
    mutationFn: (id: string) => loansApi.renew(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loans'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to renew loan');
      console.error('Renew loan error:', error);
    },
  });

  if (isError) return <ErrorState message="Failed to load loans" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Loans</h1>
        <select className="input max-w-40" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
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
                  <th className="py-2">Borrowed</th>
                  <th className="py-2">Due</th>
                  <th className="py-2">Status</th>
                  {canManage && <th className="py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((loan) => (
                  <StaggerItem key={loan.id}>
                    <tr className="border-b border-cream-200">
                      <td className="py-3">{loan.bookCopy?.book?.title || 'N/A'}</td>
                      <td className="py-3">{loan.member?.user?.name || 'N/A'}</td>
                      <td className="py-3 text-sm">{formatDate(loan.borrowedAt)}</td>
                      <td className="py-3 text-sm">
                        {formatDate(loan.dueDate)}
                        {loan.status === 'ACTIVE' && daysUntil(loan.dueDate) < 0 && (
                          <span className="text-red-500 ml-1">({daysUntil(loan.dueDate)}d)</span>
                        )}
                      </td>
                      <td className="py-3"><span className={`badge ${getStatusColor(loan.status)}`}>{loan.status}</span></td>
                      {canManage && (
                        <td className="py-3">
                          <div className="flex gap-1">
                            {loan.status !== 'RETURNED' && (
                              <Button size="sm" variant="secondary" loading={returnMutation.isPending} onClick={() => returnMutation.mutate(loan.id)}>
                                <BookCheck className="w-4 h-4" />
                              </Button>
                            )}
                            {loan.status !== 'RETURNED' && (
                              <Button size="sm" variant="ghost" loading={renewMutation.isPending} onClick={() => renewMutation.mutate(loan.id)}>
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            )}
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
