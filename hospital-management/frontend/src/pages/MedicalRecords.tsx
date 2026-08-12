import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { formatDate } from '../lib/utils';
import type { MedicalRecord } from '../types';

export default function MedicalRecords() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['medical-records'],
    queryFn: async () => {
      const { data } = await api.get('/medical-records', { params: { limit: 50 } });
      return data;
    },
  });

  if (isError) return <ErrorState message="Failed to load medical records" onRetry={() => refetch()} />;
  if (isLoading) {
    return <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>;
  }

  if (!data?.items?.length) {
    return <EmptyState title="No medical records" description="Medical records will appear here after appointments" />;
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
      <div className="space-y-4">
        {data.items.map((record: MedicalRecord, idx: number) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-12"
          >
            <div className="absolute left-3 top-4 w-5 h-5 rounded-full bg-teal-600 border-4 border-white shadow" />
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-teal-600" size={18} />
                  <span className="font-medium text-slate-900">
                    {record.patient?.user?.name || 'Unknown patient'}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{formatDate(record.createdAt)}</span>
              </div>
              {record.complaints && (
                <p className="text-sm text-slate-600"><span className="font-medium">Complaints:</span> {record.complaints}</p>
              )}
              {record.diagnosis && (
                <p className="text-sm text-slate-600 mt-1"><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
              )}
              {record.prescriptions && (
                <p className="text-sm text-slate-600 mt-1"><span className="font-medium">Prescriptions:</span> {record.prescriptions}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Doctor: {record.doctor?.user?.name} · {record.doctor?.specialization}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
