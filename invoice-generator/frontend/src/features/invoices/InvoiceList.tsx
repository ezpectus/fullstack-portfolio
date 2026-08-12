import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { invoicesApi } from '../../api/endpoints';
import { StaggerContainer, StaggerItem, Skeleton } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { useDebounce } from '../../hooks';
import { FilePlus, Search } from 'lucide-react';

export default function InvoiceList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoices', page, debouncedSearch, status],
    queryFn: () => invoicesApi.list({ page, search: debouncedSearch, status }),
  });

  if (isError) return <ErrorState message="Failed to load invoices" onRetry={() => refetch()} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link to="/invoices/new" className="btn-primary"><FilePlus size={16} /> New Invoice</Link>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input w-40">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <>
          <StaggerContainer>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Number</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Issue Date</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((invoice) => (
                    <StaggerItem key={invoice.id}>
                      <motion.tr whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3">
                          <Link to={`/invoices/${invoice.id}`} className="font-medium text-primary-600 hover:underline">{invoice.number}</Link>
                        </td>
                        <td className="px-4 py-3">{invoice.client?.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(invoice.issueDate)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(invoice.dueDate)}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(invoice.total, invoice.currency)}</td>
                        <td className="px-4 py-3"><span className={`badge ${getStatusColor(invoice.status)}`}>{invoice.status}</span></td>
                      </motion.tr>
                    </StaggerItem>
                  ))}
                </tbody>
              </table>
            </div>
          </StaggerContainer>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">Prev</button>
              <span className="text-sm text-gray-500">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-secondary">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
