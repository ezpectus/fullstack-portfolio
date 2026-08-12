import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { membersApi } from '../../api';
import { PageTransition, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { getStatusColor, formatDate, formatCurrency } from '../../lib/utils';

export default function MemberDetail() {
  const { id } = useParams();

  const { data: member, isLoading, isError, refetch } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.getById(id!),
  });

  if (isLoading) return <SkeletonShimmer className="h-96" />;
  if (isError) return <ErrorState message="Failed to load member details" onRetry={() => refetch()} />;
  if (!member) return <div className="text-center py-8 text-gray-500">Member not found</div>;

  return (
    <PageTransition>
      <Link to="/members" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-serif text-amber-700">
              {member.user?.name?.charAt(0) || 'M'}
            </div>
            <div>
              <h2 className="text-xl font-serif">{member.user?.name}</h2>
              <span className={`badge ${getStatusColor(member.status)}`}>{member.status}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /> {member.user?.email}</div>
            {member.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /> {member.phone}</div>}
            {member.address && <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /> {member.address}</div>}
            <div className="flex items-center gap-2 text-gray-600"><CreditCard className="w-4 h-4" /> {member.cardNumber}</div>
            <div className="text-gray-500">Joined: {formatDate(member.joinedAt)}</div>
          </div>
        </div>

        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-serif mb-4">Recent Loans</h3>
          <div className="space-y-2">
            {member.loans?.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between py-2 border-b border-cream-200 last:border-0">
                <div>
                  <div className="font-medium">{loan.bookCopy?.book?.title}</div>
                  <div className="text-sm text-gray-500">Due: {formatDate(loan.dueDate)}</div>
                </div>
                <span className={`badge ${getStatusColor(loan.status)}`}>{loan.status}</span>
              </div>
            ))}
            {(!member.loans || member.loans.length === 0) && <p className="text-gray-400">No loans</p>}
          </div>
        </div>
      </div>

      {member.fines && member.fines.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-serif mb-4">Fines</h3>
          <div className="space-y-2">
            {member.fines.map((fine) => (
              <div key={fine.id} className="flex items-center justify-between py-2 border-b border-cream-200 last:border-0">
                <div>
                  <div className="font-medium">{formatCurrency(fine.amount)}</div>
                  <div className="text-sm text-gray-500">{fine.reason}</div>
                </div>
                <span className={`badge ${getStatusColor(fine.status)}`}>{fine.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
