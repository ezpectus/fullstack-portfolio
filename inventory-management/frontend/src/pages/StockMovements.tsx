import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDateTime } from '@/lib/utils';
import type { StockMovement, PaginatedResponse } from '@/types';

export default function StockMovements() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<StockMovement>>({
    queryKey: ['stock-movements', page],
    queryFn: async () => (await api.get('/stock-movements', { params: { page, limit: 20 } })).data,
  });

  const typeIcon = {
    IN: TrendingUp,
    OUT: TrendingDown,
    TRANSFER: ArrowLeftRight,
    ADJUSTMENT: RefreshCw,
  };

  if (isError) return <ErrorState message="Failed to load stock movements" onRetry={() => refetch()} />;

  const typeColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
    IN: 'success',
    OUT: 'destructive',
    TRANSFER: 'secondary',
    ADJUSTMENT: 'warning',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        <p className="text-muted-foreground mt-1">Track all inventory movements</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : data?.items?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-sm font-medium">Product</th>
                  <th className="text-left p-4 text-sm font-medium">Warehouse</th>
                  <th className="text-center p-4 text-sm font-medium">Type</th>
                  <th className="text-right p-4 text-sm font-medium">Qty</th>
                  <th className="text-left p-4 text-sm font-medium">Comment</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((movement, i) => {
                  const Icon = typeIcon[movement.type];
                  return (
                    <motion.tr
                      key={movement.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-4 text-sm text-muted-foreground">{formatDateTime(movement.createdAt)}</td>
                      <td className="p-4 text-sm font-medium">{movement.product?.name || 'N/A'}</td>
                      <td className="p-4 text-sm">{movement.warehouse?.name || 'N/A'}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          <Badge variant={typeColor[movement.type]}>{movement.type}</Badge>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm font-semibold">{movement.quantity}</td>
                      <td className="p-4 text-sm text-muted-foreground">{movement.comment || '-'}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No stock movements found</p>
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
