import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, BookOpen, CalendarClock } from 'lucide-react';
import { booksApi, reservationsApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { getStatusColor } from '../../lib/utils';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const { data: book, isLoading, isError, refetch } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id!),
  });

  const reserveMutation = useMutation({
    mutationFn: () => reservationsApi.create({ bookId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to reserve book');
      console.error('Reserve book error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => booksApi.delete(id!),
    onSuccess: () => navigate('/books'),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Failed to delete book');
      console.error('Delete book error:', error);
    },
  });

  if (isLoading) return <SkeletonShimmer className="h-96" />;
  if (isError) return <ErrorState message="Failed to load book details" onRetry={() => refetch()} />;

  if (!book) return <div className="text-center py-8 text-gray-500">Book not found</div>;

  return (
    <PageTransition>
      <Link to="/books" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Books
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center">
          <div className="aspect-[3/4] w-full bg-cream-200 rounded-lg flex items-center justify-center mb-4">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <BookOpen className="w-20 h-20 text-amber-600" />
            )}
          </div>
          {canManage && (
            <div className="flex gap-2 w-full">
              <Link to={`/books/${id}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full"><Edit className="w-4 h-4 mr-1 inline" /> Edit</Button>
              </Link>
              <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card">
          <h1 className="text-2xl font-serif mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-4">by {book.authors}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {book.isbn && <div><span className="text-sm text-gray-500">ISBN</span><div className="font-medium">{book.isbn}</div></div>}
            {book.publisher && <div><span className="text-sm text-gray-500">Publisher</span><div className="font-medium">{book.publisher}</div></div>}
            {book.publishYear && <div><span className="text-sm text-gray-500">Published</span><div className="font-medium">{book.publishYear}</div></div>}
            {book.genre && <div><span className="text-sm text-gray-500">Genre</span><div className="font-medium">{book.genre}</div></div>}
          </div>

          {book.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Copies</h3>
            <div className="space-y-2">
              {book.copies?.map((copy) => (
                <div key={copy.id} className="flex items-center justify-between py-2 px-3 bg-cream-50 rounded-lg">
                  <span className="font-mono text-sm">{copy.code}</span>
                  <span className={`badge ${getStatusColor(copy.status)}`}>{copy.status}</span>
                </div>
              ))}
              {(!book.copies || book.copies.length === 0) && <p className="text-gray-400">No copies available</p>}
            </div>
          </div>

          {user?.role === 'MEMBER' && (
            <Button loading={reserveMutation.isPending} onClick={() => reserveMutation.mutate()}>
              <CalendarClock className="w-4 h-4 mr-1 inline" /> Reserve This Book
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
