import { useDashboard } from '../../api/hooks';
import { PageTransition, StaggerList, StaggerItem, AnimatedCounter, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/EmptyState';
import { Link2, MousePointerClick, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <SkeletonShimmer className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonShimmer key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <SkeletonShimmer className="h-64 rounded-2xl" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Links', value: data?.totalLinks ?? 0, icon: Link2, color: 'text-primary' },
    { label: 'Active Links', value: data?.activeLinks ?? 0, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Clicks', value: data?.totalClicks ?? 0, icon: MousePointerClick, color: 'text-accent' },
  ];

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your URL shortener activity</p>
        </div>

        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <Card className="glass-card hover:neon-border transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                        <AnimatedCounter value={stat.value} />
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Clicks Over Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.clicksByDay ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.topLinks?.map((link) => (
                <Link
                  key={link.id}
                  to={`/links/${link.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{link.shortCode}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
                  </div>
                  <Badge variant="default" className="ml-2">{link.clicks} clicks</Badge>
                </Link>
              )) ?? <p className="text-sm text-muted-foreground">No links yet</p>}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Recent Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.recentLinks?.map((link) => (
                <Link
                  key={link.id}
                  to={`/links/${link.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{link.shortCode}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              )) ?? <p className="text-sm text-muted-foreground">No links yet</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
