import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { ChartReveal } from '../components/animations/MotionComponents';

type Tab = 'appointments' | 'patients' | 'doctors' | 'revenue';

export default function Reports() {
  const [tab, setTab] = useState<Tab>('appointments');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reports', tab],
    queryFn: async () => {
      const { data } = await api.get(`/reports/${tab}`);
      return data;
    },
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'appointments', label: 'Appointments' },
    { key: 'patients', label: 'Patients' },
    { key: 'doctors', label: 'Doctors' },
    { key: 'revenue', label: 'Revenue' },
  ];

  if (isError) return <ErrorState message="Failed to load report data" onRetry={() => refetch()} />;
  if (isLoading) return <SkeletonCard />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <ChartReveal>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-teal-600" size={20} />
            <h3 className="font-semibold text-slate-900 capitalize">{tab} Report</h3>
          </div>

          {tab === 'appointments' && (
            <div className="space-y-3">
              <div className="text-2xl font-bold text-slate-900">Total: {data?.total || 0}</div>
              {data?.byStatus?.map((s: any) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">{s.status.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-medium text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'patients' && (
            <div className="space-y-3">
              <div className="text-2xl font-bold text-slate-900">Total: {data?.total || 0}</div>
              {data?.byGender?.map((g: any) => (
                <div key={g.gender} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{g.gender}</span>
                  <span className="font-medium text-slate-900">{g.count}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'doctors' && (
            <div className="space-y-3">
              <div className="text-2xl font-bold text-slate-900">Total: {data?.total || 0}</div>
              {data?.bySpecialization?.map((s: any) => (
                <div key={s.specialization} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{s.specialization}</span>
                  <span className="font-medium text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'revenue' && (
            <div className="space-y-3">
              <div className="text-2xl font-bold text-teal-700">
                ${data?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-slate-500">From {data?.totalAppointments || 0} completed appointments</p>
              {data?.bySpecialization?.map((s: any) => (
                <div key={s.specialization} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{s.specialization}</span>
                  <span className="font-medium text-slate-900">${s.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </ChartReveal>
    </div>
  );
}
