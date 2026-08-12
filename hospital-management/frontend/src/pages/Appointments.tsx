import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { formatDateTime, getStatusColor } from '../lib/utils';
import type { Appointment } from '../types';

export default function Appointments() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments', { params: { limit: 50 } });
      return data;
    },
  });

  if (isError) return <ErrorState message="Failed to load appointments" onRetry={() => refetch()} />;
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!data?.items?.length) {
    return <EmptyState title="No appointments" description="Schedule a new appointment to get started" />;
  }

  return (
    <div className="space-y-3">
      {data.items.map((appt: Appointment, idx: number) => (
        <motion.div
          key={appt.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <CalendarDays className="text-teal-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {appt.doctor.user.name} → {appt.patient.user.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDateTime(appt.startTime)}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(appt.status)}>
                {appt.status.replace(/_/g, ' ').toLowerCase()}
              </Badge>
            </div>
            {appt.reason && (
              <p className="text-sm text-slate-600 mt-2 pl-14">{appt.reason}</p>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
