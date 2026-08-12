import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardApi } from '../../api/endpoints';
import { StaggerContainer, StaggerItem, AnimatedCounter, Skeleton, ScrollReveal } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { FilePlus, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.stats });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const stats = data?.counts || { total: 0, draft: 0, sent: 0, paid: 0, overdue: 0 };
  const monthly = data?.monthly || { billed: 0, paid: 0 };
  const overdueAmount = data?.overdueAmount || 0;

  const cards = [
    { label: 'Total Invoices', value: stats.total, icon: FilePlus, color: 'text-primary-600' },
    { label: 'Monthly Billed', value: monthly.billed, icon: TrendingUp, color: 'text-blue-600', isCurrency: true },
    { label: 'Monthly Paid', value: monthly.paid, icon: CheckCircle, color: 'text-primary-600', isCurrency: true },
    { label: 'Overdue Amount', value: overdueAmount, icon: AlertCircle, color: 'text-red-600', isCurrency: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/invoices/new" className="btn-primary">
          <FilePlus size={16} /> New Invoice
        </Link>
      </div>

      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StaggerItem key={card.label}>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <card.icon className={card.color} size={20} />
                </div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold">
                  {card.isCurrency ? <AnimatedCounter value={card.value} /> : card.value}
                </p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollReveal>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Status Breakdown</h2>
            <div className="space-y-3">
              {[
                { label: 'Draft', count: stats.draft, icon: Clock, color: 'bg-gray-100 text-gray-700' },
                { label: 'Sent', count: stats.sent, icon: TrendingUp, color: 'bg-blue-100 text-blue-700' },
                { label: 'Paid', count: stats.paid, icon: CheckCircle, color: 'bg-primary-100 text-primary-700' },
                { label: 'Overdue', count: stats.overdue, icon: AlertCircle, color: 'bg-red-100 text-red-700' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`badge ${item.color}`}><item.icon size={14} /></span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
            {data?.recentInvoices?.length ? (
              <div className="space-y-2">
                {data.recentInvoices.slice(0, 5).map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Link to={`/invoices/${invoice.id}`} className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{invoice.number}</p>
                      <p className="text-xs text-gray-500">{invoice.client?.name || '—'}</p>
                    </Link>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(invoice.total, invoice.currency)}</p>
                      <span className={`badge ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No invoices yet</p>
            )}
          </div>
        </ScrollReveal>
      </div>

      {data?.topClients && data.topClients.length > 0 && (
        <ScrollReveal delay={0.2}>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Top Clients</h2>
            <div className="space-y-2">
              {data.topClients.map((client: { id: string; name: string; totalBilled: number }) => (
                <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="text-sm font-medium">{client.name}</span>
                  <span className="text-sm font-semibold">{formatCurrency(client.totalBilled)}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
