import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { StaggerContainer, StaggerItem, AnimatedNumber } from '../components/animations/MotionComponents';
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils';
import type { DashboardOverview } from '../types';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery<DashboardOverview>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/overview');
      return data.data;
    },
  });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const stats = data?.stats;
  const statCards = [
    { label: 'Total Revenue', value: stats?.totalRevenue || 0, icon: DollarSign, format: (v: number) => formatCurrency(v), color: 'text-primary' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, format: (v: number) => String(v), color: 'text-accent' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, format: (v: number) => String(v), color: 'text-blue-600' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, format: (v: number) => String(v), color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store performance</p>
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

      {stats && stats.pendingOrders > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              {stats.pendingOrders} pending order{stats.pendingOrders > 1 ? 's' : ''} need attention
            </p>
            <Link to="/orders" className="ml-auto text-sm font-medium text-primary hover:underline">
              View Orders
            </Link>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <Link to="/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Order #</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <Link to={`/orders/${order.id}`} className="font-medium text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-foreground">{order.customer?.name || 'N/A'}</td>
                    <td className="py-3 font-medium text-foreground">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {(!data?.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
