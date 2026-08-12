import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, BookOpen } from 'lucide-react';
import { booksApi } from '../../api';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { getStatusColor } from '../../lib/utils';
import { useDebounce } from '../../hooks/useDebounce';

export default function BookList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['books', page, debouncedSearch],
    queryFn: () => booksApi.list({ page, limit: 12, search: debouncedSearch }),
  });

  if (isError) return <ErrorState message="Failed to load books" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Books</h1>
        {canManage && (
          <Link to="/books/new">
            <Button><Plus className="w-4 h-4 mr-1 inline" /> Add Book</Button>
          </Link>
        )}
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonShimmer key={i} className="h-56" />)}
        </div>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.items.map((book) => (
              <StaggerItem key={book.id}>
                <Link to={`/books/${book.id}`}>
                  <div className="card hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="aspect-[3/4] bg-cream-200 rounded-lg mb-3 flex items-center justify-center">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-amber-600" />
                      )}
                    </div>
                    <h3 className="font-serif text-lg truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{book.authors}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {book.genre && <span className={`badge ${getStatusColor('AVAILABLE')}`}>{book.genre}</span>}
                      <span className="badge bg-blue-100 text-blue-700">{book.copies?.length || 0} copies</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <span className="text-sm text-gray-600">Page {page} of {data.totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
