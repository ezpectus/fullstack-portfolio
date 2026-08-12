import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Schedule() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['schedule'],
    queryFn: async () => {
      const { data } = await api.get('/doctors', { params: { limit: 1 } });
      if (data.items?.length > 0) {
        const { data: schedule } = await api.get(`/schedule/${data.items[0].id}/working-hours`);
        return schedule;
      }
      return [];
    },
  });

  if (isError) return <ErrorState message="Failed to load schedule" onRetry={() => refetch()} />;
  if (isLoading) return <SkeletonCard />;
  if (!data?.length) return <EmptyState title="No schedule" description="No working hours configured" />;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-teal-600" size={20} />
          <h3 className="font-semibold text-slate-900">Weekly Schedule</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {DAYS.map((day, idx) => {
            const hours = data.filter((h: any) => h.dayOfWeek === idx && !h.isBreak);
            const breaks = data.filter((h: any) => h.dayOfWeek === idx && h.isBreak);
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-lg border border-slate-200 min-h-[100px]"
              >
                <p className="text-xs font-medium text-slate-500 mb-2">{day}</p>
                {hours.length > 0 ? (
                  hours.map((h: any) => (
                    <div key={h.id} className="text-sm text-slate-900">
                      {h.startTime} - {h.endTime}
                    </div>
                ))
                ) : (
                  <p className="text-xs text-slate-400">Off</p>
                )}
                {breaks.map((b: any) => (
                  <div key={b.id} className="text-xs text-amber-600 mt-1">
                    Break: {b.startTime} - {b.endTime}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
