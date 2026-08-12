import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, RotateCcw } from 'lucide-react';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { ChartReveal, StaggerContainer, StaggerItem, AnimatedNumber } from '../components/animations/MotionComponents';
import { formatCurrency } from '../lib/utils';
import type { AnalyticsSummary, RevenuePoint, OrdersPoint, TopProduct, TopCategory } from '../types';

const PIE_COLORS = ['#ec4899', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#3b82f6', '#10b981'];

export default function Analytics() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useQuery<AnalyticsSummary>({
    queryKey: ['analytics-summary'],
    queryFn: async () => (await api.get('/analytics/summary')).data.data,
  });
  const { data: revenue, isLoading: revLoading } = useQuery<RevenuePoint[]>({
    queryKey: ['analytics-revenue'],
    queryFn: async () => (await api.get('/analytics/revenue')).data.data,
  });
  const { data: orders, isLoading: ordLoading } = useQuery<OrdersPoint[]>({
    queryKey: ['analytics-orders'],
    queryFn: async () => (await api.get('/analytics/orders')).data.data,
  });
  const { data: topProducts, isLoading: tpLoading } = useQuery<TopProduct[]>({
    queryKey: ['analytics-top-products'],
    queryFn: async () => (await api.get('/analytics/top-products')).data.data,
  });
  const { data: topCategories, isLoading: tcLoading } = useQuery<TopCategory[]>({
    queryKey: ['analytics-top-categories'],
    queryFn: async () => (await api.get('/analytics/top-categories')).data.data,
  });

  if (summaryError) return <ErrorState message="Failed to load analytics data" onRetry={() => refetchSummary()} />;
  if (summaryLoading) return <Skeleton className="h-96" />;

  const statCards = [
    { label: 'Total Revenue', value: summary?.totalRevenue || 0, icon: DollarSign, format: (v: number) => formatCurrency(v), color: 'text-primary' },
    { label: 'Orders', value: summary?.orderCount || 0, icon: ShoppingBag, format: (v: number) => String(v), color: 'text-accent' },
    { label: 'Avg Order Value', value: summary?.avgOrderValue || 0, icon: TrendingUp, format: (v: number) => formatCurrency(v), color: 'text-blue-600' },
    { label: 'Refund Rate', value: summary?.refundRate || 0, icon: RotateCcw, format: (v: number) => `${v.toFixed(1)}%`, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your store performance</p>
      </div>

      <StaggerContainer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StaggerItem key={stat.label}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                      <AnimatedNumber value={stat.value} format={stat.format} />
                    </p>
                  </div>
                  <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartReveal>
          <Card>
            <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
            <CardContent>
              {revLoading ? <Skeleton className="h-64" /> : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </ChartReveal>

        <ChartReveal>
          <Card>
            <CardHeader><CardTitle>Orders Over Time</CardTitle></CardHeader>
            <CardContent>
              {ordLoading ? <Skeleton className="h-64" /> : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={orders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </ChartReveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            {tpLoading ? <Skeleton className="h-48" /> : (
              <div className="space-y-2">
                {topProducts?.slice(0, 5).map((item, idx) => (
                  <div key={item.productId} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-foreground">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-muted-foreground">{item._sum.quantity} sold</p>
                    </div>
                    <p className="font-medium text-foreground">{formatCurrency(item._sum.totalPrice || 0)}</p>
                  </div>
                ))}
                {(!topProducts || topProducts.length === 0) && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No data available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <ChartReveal>
          <Card>
            <CardHeader><CardTitle>Top Categories by Revenue</CardTitle></CardHeader>
            <CardContent>
              {tcLoading ? <Skeleton className="h-64" /> : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                    >
                      {topCategories?.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </ChartReveal>
      </div>
    </div>
  );
}
