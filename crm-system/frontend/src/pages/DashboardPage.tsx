import { useDashboardStats, useDashboardDealsByStage, useDashboardNewCustomers, useDashboardRecentActivity } from '@/api/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { ScrollReveal, AnimatedCounter } from '@/components/animations/MotionComponents';
import { Users, TrendingUp, DollarSign, Trophy } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: dealsByStage, isLoading: dealsLoading } = useDashboardDealsByStage();
  const { data: newCustomers, isLoading: customersLoading } = useDashboardNewCustomers();
  const { data: recentActivity, isLoading: activityLoading } = useDashboardRecentActivity();

  if (statsError) return <ErrorState message="Failed to load dashboard" />;

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: Users, color: 'text-blue-500' },
    { label: 'Active Deals', value: stats?.activeDeals ?? 0, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Pipeline Value', value: stats?.pipelineAmount ?? 0, icon: DollarSign, color: 'text-green-500', isCurrency: true },
    { label: 'Won This Month', value: stats?.wonThisMonth ?? 0, icon: Trophy, color: 'text-amber-500', isCurrency: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your CRM activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <ScrollReveal key={card.label} delay={i * 0.1}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.label}
                      </CardTitle>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {card.isCurrency
                          ? formatCurrency(card.value)
                          : <AnimatedCounter value={card.value} />}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deals by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              {dealsLoading ? (
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dealsByStage ?? []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="stage" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New Customers (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={newCustomers ?? []}>
                    <defs>
                      <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tickFormatter={(v) => formatDate(v).split(',')[0]} />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Recent Activity */}
      <ScrollReveal delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.meta}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(activity.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
