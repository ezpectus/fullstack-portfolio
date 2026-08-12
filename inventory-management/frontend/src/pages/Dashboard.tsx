import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Warehouse, Truck, ArrowLeftRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDateTime } from '@/lib/utils';
import type { DashboardMetrics, InventoryTrend } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { data: metrics, isError: metricsError, refetch: refetchMetrics } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });

  const { data: trends, isError: trendsError, refetch: refetchTrends } = useQuery<InventoryTrend[]>({
    queryKey: ['dashboard', 'trends'],
    queryFn: async () => (await api.get('/dashboard/trends')).data,
  });

  if (metricsError || trendsError) return <ErrorState message="Failed to load dashboard data" onRetry={() => { refetchMetrics(); refetchTrends(); }} />;

  const stats = [
    { label: 'Total Products', value: metrics?.totalProducts ?? 0, icon: Package, color: 'text-blue-500' },
    { label: 'Warehouses', value: metrics?.totalWarehouses ?? 0, icon: Warehouse, color: 'text-green-500' },
    { label: 'Suppliers', value: metrics?.totalSuppliers ?? 0, icon: Truck, color: 'text-purple-500' },
    { label: 'Stock Movements', value: metrics?.totalMovements ?? 0, icon: ArrowLeftRight, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your inventory system</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.lowStockAlerts?.length ? (
              <div className="space-y-2">
                {metrics.lowStockAlerts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-md bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Min: {product.minStock}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No low stock alerts</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.recentMovements?.length ? (
              <div className="space-y-2">
                {metrics.recentMovements.slice(0, 5).map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center gap-2">
                      {movement.type === 'IN' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{movement.product?.name || 'Product'}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(movement.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant={movement.type === 'IN' ? 'success' : 'destructive'}>
                      {movement.type} {movement.quantity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent movements</p>
            )}
          </CardContent>
        </Card>
      </div>

      {trends && trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trends.slice(-10).map((trend) => (
                <div key={trend.date} className="flex items-center gap-4 p-2 rounded-md border">
                  <span className="text-sm text-muted-foreground w-24">{trend.date}</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-sm">{trend.in} in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-sm">{trend.out} out</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
