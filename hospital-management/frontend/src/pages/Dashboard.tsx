import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Stethoscope, Building2, TrendingUp, Activity } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { AnimatedNumber, ChartReveal, StaggerContainer, StaggerItem } from '../components/animations/MotionComponents';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data;
    },
  });

  if (isError) return <ErrorState message="Failed to load dashboard data" onRetry={() => refetch()} />;
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const stats = [
    { label: 'Appointments Today', value: data?.appointmentsToday || 0, icon: CalendarDays, color: 'bg-sky-500' },
    { label: 'Total Patients', value: data?.totalPatients || 0, icon: Users, color: 'bg-teal-500' },
    { label: 'Active Doctors', value: data?.totalDoctors || 0, icon: Stethoscope, color: 'bg-emerald-500' },
    { label: 'Departments', value: data?.departments || 0, icon: Building2, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="text-white" size={20} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">
                  <AnimatedNumber value={stat.value} />
                </p>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartReveal>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-teal-600" size={20} />
              <h3 className="font-semibold text-slate-900">Appointments by Status</h3>
            </div>
            <div className="space-y-3">
              {data?.appointmentsByStatus?.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.status.replace(/_/g, ' ').toLowerCase()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / Math.max(...data.appointmentsByStatus.map((s: any) => s.count), 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-teal-500 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ChartReveal>

        <ChartReveal delay={0.2}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-sky-600" size={20} />
              <h3 className="font-semibold text-slate-900">Top Specializations</h3>
            </div>
            <div className="space-y-3">
              {data?.topSpecializations?.map((spec: any) => (
                <div key={spec.specialization} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{spec.specialization}</span>
                  <span className="text-sm font-medium text-slate-900">{spec.count} doctors</span>
                </div>
              ))}
            </div>
          </Card>
        </ChartReveal>
      </div>

      <ChartReveal delay={0.3}>
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Doctors by Load (This Week)</h3>
          <div className="space-y-3">
            {data?.topDoctors?.map((doc: any) => (
              <motion.div
                key={doc.doctorId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-medium">
                    {doc.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.specialization}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-900">{doc.appointments} appts</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </ChartReveal>
    </div>
  );
}
