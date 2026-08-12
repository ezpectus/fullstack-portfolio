import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { bookCopiesApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getStatusColor } from '../../lib/utils';

export default function BookCopies() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newCopy, setNewCopy] = useState({ bookId: '', code: '', condition: 'good' });
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['book-copies', page],
    queryFn: () => bookCopiesApi.list({ page, limit: 20 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: { bookId: string; code: string; condition: string }) => bookCopiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-copies'] });
      setShowForm(false);
      setNewCopy({ bookId: '', code: '', condition: 'good' });
    },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to create book copy');
      console.error('Create book copy error:', error);
    },
  });

  if (isError) return <ErrorState message="Failed to load book copies" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Book Copies</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1 inline" /> Add Copy</Button>
      </div>

      {showForm && (
        <div className="card mb-4 space-y-3">
          <Input label="Book ID" value={newCopy.bookId} onChange={(e) => setNewCopy({ ...newCopy, bookId: e.target.value })} />
          <Input label="Copy Code" value={newCopy.code} onChange={(e) => setNewCopy({ ...newCopy, code: e.target.value })} />
          <Input label="Condition" value={newCopy.condition} onChange={(e) => setNewCopy({ ...newCopy, condition: e.target.value })} />
          <Button loading={createMutation.isPending} onClick={() => createMutation.mutate(newCopy)}>Create Copy</Button>
        </div>
      )}

      {isLoading ? (
        <SkeletonShimmer className="h-64" />
      ) : (
        <>
          <StaggerContainer>
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-300 text-left text-sm text-gray-500">
                  <th className="py-2">Code</th>
                  <th className="py-2">Book</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Condition</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((copy) => (
                  <StaggerItem key={copy.id}>
                    <tr className="border-b border-cream-200">
                      <td className="py-3 font-mono text-sm">{copy.code}</td>
                      <td className="py-3">{copy.book?.title}</td>
                      <td className="py-3"><span className={`badge ${getStatusColor(copy.status)}`}>{copy.status}</span></td>
                      <td className="py-3 capitalize">{copy.condition}</td>
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
