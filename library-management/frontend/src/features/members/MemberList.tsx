import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { membersApi } from '../../api';
import { PageTransition, StaggerContainer, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { getStatusColor, formatDate } from '../../lib/utils';
import { useDebounce } from '../../hooks/useDebounce';

export default function MemberList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['members', page, debouncedSearch],
    queryFn: () => membersApi.list({ page, limit: 20, search: debouncedSearch }),
  });

  if (isError) return <ErrorState message="Failed to load members" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <h1 className="text-2xl font-serif mb-6">Members</h1>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input placeholder="Search members..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
      </div>

      {isLoading ? (
        <SkeletonShimmer className="h-64" />
      ) : (
        <>
          <StaggerContainer>
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-300 text-left text-sm text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Card Number</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Joined</th>
                  <th className="py-2">Loans</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((member) => (
                  <StaggerItem key={member.id}>
                    <tr className="border-b border-cream-200 hover:bg-cream-50">
                      <td className="py-3">
                        <Link to={`/members/${member.id}`} className="hover:text-amber-600">
                          {member.user?.name || 'N/A'}
                        </Link>
                      </td>
                      <td className="py-3 font-mono text-sm">{member.cardNumber}</td>
                      <td className="py-3"><span className={`badge ${getStatusColor(member.status)}`}>{member.status}</span></td>
                      <td className="py-3 text-sm">{formatDate(member.joinedAt)}</td>
                      <td className="py-3">{member._count?.loans || 0}</td>
                    </tr>
                  </StaggerItem>
                ))}
              </tbody>
            </table>
          </StaggerContainer>
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button className="btn btn-secondary text-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span className="text-sm">Page {page} of {data.totalPages}</span>
              <button className="btn btn-secondary text-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
