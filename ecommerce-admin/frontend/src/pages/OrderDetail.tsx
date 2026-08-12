import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, User, CreditCard, MapPin } from 'lucide-react';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { useToastStore } from '../store/toastStore';
import { formatCurrency, formatDateTime, getStatusColor } from '../lib/utils';
import type { Order, OrderStatus } from '../types';

const statusFlow: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrderDetail() {
  const { id } = useParams();
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError, refetch } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      addToast('Order status updated', 'success');
    },
    onError: () => addToast('Failed to update status', 'error'),
  });

  if (isLoading) return <Skeleton className="h-96" />;
  if (isError) return <ErrorState message="Failed to load order details" onRetry={() => refetch()} />;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/orders" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <Select
            value={order.status}
            onChange={(e) => statusMutation.mutate(e.target.value as OrderStatus)}
            className="w-40"
          >
            {statusFlow.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                        {item.variant && ` (${item.variant.name})`}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {order.statusHistory?.map((hist, idx) => (
                  <motion.div
                    key={hist.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      {idx < (order.statusHistory?.length || 0) - 1 && <div className="h-12 w-px bg-border" />}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-foreground">{hist.status}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(hist.createdAt)}</p>
                      {hist.user && <p className="text-xs text-muted-foreground">by {hist.user.name}</p>}
                      {hist.comment && <p className="text-xs text-muted-foreground italic">{hist.comment}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">{formatCurrency(order.taxTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{formatCurrency(order.shippingTotal)}</span></div>
                {order.discountTotal > 0 && (
                  <div className="flex justify-between text-primary"><span>Discount</span><span>-{formatCurrency(order.discountTotal)}</span></div>
                )}
                <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                  <span className="text-foreground">Total</span><span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{order.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-foreground">{order.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
