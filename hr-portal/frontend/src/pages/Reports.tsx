import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, BarChart3, Users, Wallet, CalendarDays, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Skeleton } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { toast } from '../components/Toast';
import { formatCurrency } from '../lib/utils';

type ReportType = 'headcount' | 'payroll' | 'leave' | 'employee';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('headcount');

  const { data: headcount, isLoading: hcLoading, isError: hcError, refetch: hcRefetch } = useQuery({
    queryKey: ['report-headcount'],
    queryFn: async () => (await api.get('/reports/headcount')).data,
    enabled: activeReport === 'headcount',
  });

  const { data: payroll, isLoading: prLoading, isError: prError, refetch: prRefetch } = useQuery({
    queryKey: ['report-payroll'],
    queryFn: async () => (await api.get('/reports/payroll')).data,
    enabled: activeReport === 'payroll',
  });

  const { data: leave, isLoading: lvLoading, isError: lvError, refetch: lvRefetch } = useQuery({
    queryKey: ['report-leave'],
    queryFn: async () => (await api.get('/reports/leave')).data,
    enabled: activeReport === 'leave',
  });

  const handleExport = async () => {
    try {
      const response = await api.get(`/reports/export?type=${activeReport}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeReport}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast('success', 'Report exported successfully');
    } catch {
      toast('error', 'Failed to export report');
    }
  };

  const tabs = [
    { id: 'headcount' as ReportType, label: 'Headcount', icon: <Users size={18} /> },
    { id: 'payroll' as ReportType, label: 'Payroll', icon: <Wallet size={18} /> },
    { id: 'leave' as ReportType, label: 'Leave', icon: <CalendarDays size={18} /> },
    { id: 'employee' as ReportType, label: 'Employees', icon: <FileText size={18} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export organizational reports"
        action={<button onClick={handleExport} className="btn-primary"><Download size={18} /> Export CSV</button>}
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={activeReport === tab.id ? 'btn-primary' : 'btn-secondary'}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeReport === 'headcount' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Headcount by Department</h3>
          {hcError ? (
            <ErrorState message="Failed to load headcount report" onRetry={() => hcRefetch()} />
          ) : hcLoading ? (
            <Skeleton className="h-[400px]" />
          ) : headcount && headcount.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={headcount}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEmployees" fill="var(--color-primary)" name="Total Employees" />
                <Bar dataKey="activeEmployees" fill="var(--color-success)" name="Active" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyStateContent />
          )}
        </Card>
      )}

      {activeReport === 'payroll' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Payroll by Department</h3>
          {prError ? (
            <ErrorState message="Failed to load payroll report" onRetry={() => prRefetch()} />
          ) : prLoading ? (
            <Skeleton className="h-[400px]" />
          ) : payroll && payroll.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={payroll}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="totalSalary" fill="var(--color-accent)" name="Total Salary" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyStateContent />
          )}
        </Card>
      )}

      {activeReport === 'leave' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Leave Statistics</h3>
          {lvError ? (
            <ErrorState message="Failed to load leave report" onRetry={() => lvRefetch()} />
          ) : lvLoading ? (
            <Skeleton className="h-[400px]" />
          ) : leave && leave.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={leave}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="leaveType" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRequests" fill="var(--color-primary)" name="Total Requests" />
                <Bar dataKey="approved" fill="var(--color-success)" name="Approved" />
                <Bar dataKey="pending" fill="var(--color-warning)" name="Pending" />
                <Bar dataKey="rejected" fill="var(--color-danger)" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyStateContent />
          )}
        </Card>
      )}

      {activeReport === 'employee' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Employee Report</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Use the CSV export button above to download the full employee report.
          </p>
        </Card>
      )}
    </div>
  );
}

function EmptyStateContent() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BarChart3 size={32} style={{ color: 'var(--color-text-muted)' }} />
      <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No data available for this report</p>
    </div>
  );
}
