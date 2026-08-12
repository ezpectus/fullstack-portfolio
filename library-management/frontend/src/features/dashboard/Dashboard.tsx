import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, DollarSign, CalendarClock } from 'lucide-react';
import { dashboardApi } from '../../api';
import { PageTransition, StaggerContainer, StaggerItem, NumberCounter, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/utils';
import type { DashboardStats } from '../../types';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonShimmer className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonShimmer key={i} className="h-28" />)}
        </div>
        <SkeletonShimmer className="h-80" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Books', value: data?.totalBooks || 0, icon: BookOpen, color: 'bg-amber-100 text-amber-700' },
    { label: 'Active Members', value: data?.activeMembers || 0, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Loans', value: data?.activeLoans || 0, icon: ArrowLeftRight, color: 'bg-green-100 text-green-700' },
    { label: 'Overdue Loans', value: data?.overdueLoans || 0, icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
    { label: 'Pending Reservations', value: data?.pendingReservations || 0, icon: CalendarClock, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Pending Fines', value: data?.pendingFines || 0, icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <PageTransition>
      <h1 className="text-2xl font-serif mb-6">Dashboard</h1>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="card">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold"><NumberCounter value={stat.value} /></div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-serif mb-4">Loans by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="loans" fill="#ca8a04" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-serif mb-4">Popular Books</h2>
          <div className="space-y-3">
            {data?.popularBooks?.slice(0, 5).map((book, i) => (
              <div key={book.id} className="flex items-center justify-between py-2 border-b border-cream-200 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-amber-600 font-bold text-lg">{i + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.authors}</div>
                  </div>
                </div>
                <span className="badge bg-amber-100 text-amber-700">{book.loanCount} loans</span>
              </div>
            ))}
            {(!data?.popularBooks || data.popularBooks.length === 0) && (
              <p className="text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {data && data.totalFineAmount > 0 && (
        <div className="card mt-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-red-600" />
            <div>
              <div className="font-semibold text-red-800">Outstanding Fines</div>
              <div className="text-2xl font-bold text-red-700">{formatCurrency(data.totalFineAmount)}</div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
