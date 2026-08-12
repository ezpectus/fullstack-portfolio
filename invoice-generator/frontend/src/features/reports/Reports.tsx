import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reportsApi } from '../../api/endpoints';
import { ScrollReveal, Skeleton } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Download } from 'lucide-react';

export default function Reports() {
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));

  const { data: revenue, isLoading: revLoading, isError: revError, refetch: revRefetch } = useQuery({
    queryKey: ['revenue', startDate, endDate],
    queryFn: () => reportsApi.revenue({ startDate, endDate }),
  });

  const { data: overdue } = useQuery({
    queryKey: ['overdue'],
    queryFn: () => reportsApi.overdue(),
  });

  const { data: topClients } = useQuery({
    queryKey: ['top-clients', startDate, endDate],
    queryFn: () => reportsApi.topClients({ startDate, endDate }),
  });

  if (revError) return <ErrorState message="Failed to load reports" onRetry={() => revRefetch()} />;

  const chartData = revenue?.chart?.map((c: { month: string; billed: number; paid: number }) => ({ month: c.month, Billed: c.billed, Paid: c.paid })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <a href={`/api/reports/revenue/csv?startDate=${startDate}&endDate=${endDate}`} className="btn-secondary">
          <Download size={16} /> Export CSV
        </a>
      </div>

      <div className="card p-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Total Billed</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(revenue?.totalBilled || 0)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Total Paid</p>
          <p className="text-2xl font-bold">{formatCurrency(revenue?.totalPaid || 0)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(revenue?.totalOutstanding || 0)}</p>
        </div>
      </div>

      {revLoading ? (
        <Skeleton className="h-72" />
      ) : (
        <ScrollReveal>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Billed vs Paid</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="Billed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paid" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollReveal delay={0.1}>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Overdue Invoices</h2>
            {overdue?.items?.length ? (
              <div className="space-y-2">
                {overdue.items.map((inv: { id: string; number: string; client?: { name: string }; dueDate: string; total: number; currency: string }) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div>
                      <p className="text-sm font-medium">{inv.number}</p>
                      <p className="text-xs text-gray-500">{inv.client?.name} · Due {formatDate(inv.dueDate)}</p>
                    </div>
                    <p className="font-semibold text-red-600">{formatCurrency(inv.total, inv.currency)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No overdue invoices</p>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Top Clients</h2>
            {topClients?.length ? (
              <div className="space-y-2">
                {topClients.map((c: { id: string; name: string; billed: number; paid: number }, idx: number) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(c.billed)}</p>
                      <p className="text-xs text-gray-500">Paid: {formatCurrency(c.paid)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No data</p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
