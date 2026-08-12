import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { invoicesApi } from '../../api/endpoints';
import { Skeleton, ScaleIn } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToastStore } from '../../store/toastStore';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Download, Send, ArrowLeft, Trash2 } from 'lucide-react';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: invoice, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.get(id!),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => invoicesApi.updateStatus(id!, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoice', id] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to update invoice status', 'error');
      console.error('Update invoice status error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => invoicesApi.delete(id!),
    onSuccess: () => navigate('/invoices'),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to delete invoice', 'error');
      console.error('Delete invoice error:', error);
    },
  });

  if (isLoading) return <div className="p-6"><Skeleton className="h-96" /></div>;
  if (isError) return <div className="p-6"><ErrorState message="Failed to load invoice" onRetry={() => refetch()} /></div>;
  if (!invoice) return <div className="p-6 text-center text-gray-500">Invoice not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
          <h1 className="text-2xl font-bold">{invoice.number}</h1>
          <span className={`badge ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
        </div>
        <div className="flex gap-2">
          {invoice.status === 'DRAFT' && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => statusMutation.mutate('SENT')} className="btn-secondary"><Send size={16} /> Mark Sent</motion.button>
          )}
          {invoice.status === 'SENT' && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => statusMutation.mutate('PAID')} className="btn-primary">Mark Paid</motion.button>
          )}
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => invoicesApi.downloadPdf(id!)} className="btn-secondary"><Download size={16} /> PDF</motion.button>
          {invoice.status === 'DRAFT' && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => deleteMutation.mutate()} className="btn-danger"><Trash2 size={16} /></motion.button>
          )}
        </div>
      </div>

      <ScaleIn>
        <div className="card p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Issue Date</p>
              <p className="font-medium">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Bill To</p>
              <p className="font-medium">{invoice.client?.name}</p>
              <p className="text-sm text-gray-500">{invoice.client?.company}</p>
              <p className="text-sm text-gray-500">{invoice.client?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Currency</p>
              <p className="font-medium">{invoice.currency}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-right py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Unit Price</th>
                <th className="text-right py-2 font-medium">Tax %</th>
                <th className="text-right py-2 font-medium">Discount</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{item.description}</td>
                  <td className="text-right py-3">{item.quantity} {item.unit}</td>
                  <td className="text-right py-3">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="text-right py-3">{item.taxRate}%</td>
                  <td className="text-right py-3">{formatCurrency(item.discount, invoice.currency)}</td>
                  <td className="text-right py-3 font-semibold">{formatCurrency(item.total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end space-y-2">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.discountTotal > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span>-{formatCurrency(invoice.discountTotal, invoice.currency)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{formatCurrency(invoice.taxTotal, invoice.currency)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span className="text-primary-600">{formatCurrency(invoice.total, invoice.currency)}</span></div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-400 uppercase mb-1">Notes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
            </div>
          )}
        </div>
      </ScaleIn>
    </div>
  );
}
