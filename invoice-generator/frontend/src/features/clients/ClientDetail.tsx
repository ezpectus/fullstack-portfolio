import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { clientsApi, invoicesApi } from '../../api/endpoints';
import { Skeleton, ScaleIn } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading, isError, refetch } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.get(id!),
    enabled: !!id,
  });

  const { data: balance } = useQuery({
    queryKey: ['client-balance', id],
    queryFn: () => clientsApi.getBalance(id!),
    enabled: !!id,
  });

  const { data: invoices } = useQuery({
    queryKey: ['client-invoices', id],
    queryFn: () => invoicesApi.list({ clientId: id }),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6"><Skeleton className="h-64" /></div>;
  if (isError) return <div className="p-6"><ErrorState message="Failed to load client" onRetry={() => refetch()} /></div>;
  if (!client) return <div className="p-6 text-center text-gray-500">Client not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/clients')} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
        <h1 className="text-2xl font-bold">{client.name}</h1>
      </div>

      <ScaleIn>
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {client.company && <p className="font-medium text-gray-600">{client.company}</p>}
              <div className="flex items-center gap-2 text-sm text-gray-500"><Mail size={14} /> {client.email}</div>
              {client.phone && <div className="flex items-center gap-2 text-sm text-gray-500"><Phone size={14} /> {client.phone}</div>}
              {(client.address || client.city || client.country) && (
                <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} /> {[client.address, client.city, client.country].filter(Boolean).join(', ')}</div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-xs text-gray-500 mb-1">Billed</p>
                <p className="font-bold text-primary-600">{formatCurrency(balance?.billed || 0)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">Paid</p>
                <p className="font-bold">{formatCurrency(balance?.paid || 0)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                <p className="font-bold text-red-600">{formatCurrency(balance?.outstanding || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Invoice History</h2>
        {invoices?.items?.length ? (
          <div className="space-y-2">
            {invoices.items.map((invoice) => (
              <motion.div key={invoice.id} whileHover={{ x: 4 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div>
                  <p className="text-sm font-medium">{invoice.number}</p>
                  <p className="text-xs text-gray-500">{formatDate(invoice.issueDate)}</p>
                </div>
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
    </div>
  );
}
