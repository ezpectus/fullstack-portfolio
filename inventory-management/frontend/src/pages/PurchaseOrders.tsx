import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, Send, PackageCheck } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToastStore } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { PurchaseOrder, PaginatedResponse } from '@/types';

const statusVariant: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  DRAFT: 'secondary',
  SENT: 'warning',
  RECEIVED: 'success',
  CANCELLED: 'destructive',
};

export default function PurchaseOrders() {
  const [page, setPage] = useState(1);
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<PurchaseOrder>>({
    queryKey: ['purchase-orders', page],
    queryFn: async () => (await api.get('/purchase-orders', { params: { page, limit: 20 } })).data,
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/purchase-orders/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      addToast('success', 'Purchase order sent');
    },
    onError: () => addToast('error', 'Failed to send order'),
  });

  const receiveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/purchase-orders/${id}/receive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      addToast('success', 'Purchase order received');
    },
    onError: () => addToast('error', 'Failed to receive order'),
  });

  if (isError) return <ErrorState message="Failed to load purchase orders" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Manage purchase orders</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Create Order</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : data?.items?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium">PO Number</th>
                  <th className="text-left p-4 text-sm font-medium">Supplier</th>
                  <th className="text-left p-4 text-sm font-medium">Warehouse</th>
                  <th className="text-center p-4 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-sm font-medium">Total</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((po, i) => (
                  <motion.tr
                    key={po.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="p-4 text-sm font-mono">{po.poNumber}</td>
                    <td className="p-4 text-sm">{po.supplier?.name || 'N/A'}</td>
                    <td className="p-4 text-sm">{po.warehouse?.name || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <Badge variant={statusVariant[po.status]}>{po.status}</Badge>
                    </td>
                    <td className="p-4 text-right text-sm font-semibold">{formatCurrency(po.total)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(po.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {po.status === 'DRAFT' && (
                          <Button variant="ghost" size="icon" onClick={() => sendMutation.mutate(po.id)} title="Send">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {po.status === 'SENT' && (
                          <Button variant="ghost" size="icon" onClick={() => receiveMutation.mutate(po.id)} title="Receive">
                            <PackageCheck className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No purchase orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {data.page} of {data.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
