import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, CalendarClock, Wallet, Building2, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import api from '../lib/api';
import { Card, StatCard } from '../components/Card';
import { PageHeader, Skeleton } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import type { DashboardStats } from '../types';

const PIE_COLORS = ['#1e3a8a', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { data: stats, isLoading, isError, refetch } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });

  const { data: deptDist } = useQuery<{ name: string; count: number }[]>({
    queryKey: ['dept-distribution'],
    queryFn: async () => (await api.get('/dashboard/department-distribution')).data,
  });

  const { data: leaveTrends } = useQuery<{ month: string; approved: number; pending: number; rejected: number }[]>({
    queryKey: ['leave-trends'],
    queryFn: async () => (await api.get('/dashboard/leave-trends')).data,
  });

  const { data: empGrowth } = useQuery<{ month: string; count: number }[]>({
    queryKey: ['employee-growth'],
    queryFn: async () => (await api.get('/dashboard/employee-growth')).data,
  });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your organization" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><Skeleton lines={3} /></Card>
          ))
        ) : (
          <>
            <StatCard label="Total Employees" value={stats?.totalEmployees ?? 0} icon={<Users size={24} />} delay={0} />
            <StatCard label="Active" value={stats?.activeEmployees ?? 0} icon={<UserCheck size={24} />} color="var(--color-success)" delay={0.1} />
            <StatCard label="On Leave" value={stats?.onLeaveEmployees ?? 0} icon={<CalendarClock size={24} />} color="var(--color-warning)" delay={0.2} />
            <StatCard label="Departments" value={stats?.totalDepartments ?? 0} icon={<Building2 size={24} />} color="var(--color-accent)" delay={0.3} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Leaves" value={stats?.pendingLeaves ?? 0} icon={<CalendarClock size={24} />} color="var(--color-warning)" delay={0.4} />
        <StatCard label="Total Payslips" value={stats?.totalPayslips ?? 0} icon={<Wallet size={24} />} delay={0.5} />
        <StatCard label="Paid Payslips" value={stats?.paidPayslips ?? 0} icon={<FileText size={24} />} color="var(--color-success)" delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card delay={0.7}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Department Distribution</h3>
          {deptDist && deptDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={deptDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {deptDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <Skeleton className="h-[300px]" />}
        </Card>

        <Card delay={0.8}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Leave Trends (Monthly)</h3>
          {leaveTrends && leaveTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="var(--color-success)" name="Approved" />
                <Bar dataKey="pending" fill="var(--color-warning)" name="Pending" />
                <Bar dataKey="rejected" fill="var(--color-danger)" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          ) : <Skeleton className="h-[300px]" />}
        </Card>

        <Card delay={0.9} className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Employee Growth</h3>
          {empGrowth && empGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={empGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} name="New Hires" />
              </LineChart>
            </ResponsiveContainer>
          ) : <Skeleton className="h-[300px]" />}
        </Card>
      </div>
    </div>
  );
}
