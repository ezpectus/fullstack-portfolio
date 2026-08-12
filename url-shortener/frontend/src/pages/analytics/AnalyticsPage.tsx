import { useAnalytics } from '../../api/hooks';
import { PageTransition, SkeletonShimmer, AnimatedCounter } from '../../components/animations/MotionComponents';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { MousePointerClick, Users, Globe, Smartphone, Chrome, Link2 } from 'lucide-react';

const PIE_COLORS = ['hsl(265, 89%, 65%)', 'hsl(292, 84%, 61%)', 'hsl(330, 80%, 60%)', 'hsl(200, 80%, 60%)', 'hsl(160, 70%, 50%)'];

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalytics();

  if (isError) return <ErrorState message="Failed to load analytics data" onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <SkeletonShimmer className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonShimmer key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Clicks', value: data?.totalClicks ?? 0, icon: MousePointerClick },
    { label: 'Unique Clicks', value: data?.uniqueClicks ?? 0, icon: Users },
  ];

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive click analytics across all your links</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-primary mt-1"><AnimatedCounter value={stat.value} /></p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Clicks Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.clicksByDay ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Top Countries</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.topCountries ?? []} layout="vertical">
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="country" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Smartphone className="w-5 h-5 text-accent" /> Devices</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data?.topDevices ?? []} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={80} label>
                    {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Chrome className="w-5 h-5 text-primary" /> Browsers</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.topBrowsers ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="browser" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Link2 className="w-5 h-5 text-accent" /> Top Referers</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data?.topReferers?.map((ref) => (
                <div key={ref.referer} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                  <span className="text-sm truncate flex-1">{ref.referer}</span>
                  <span className="text-sm text-primary font-medium ml-2">{ref.count}</span>
                </div>
              )) ?? <p className="text-sm text-muted-foreground">No data</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
