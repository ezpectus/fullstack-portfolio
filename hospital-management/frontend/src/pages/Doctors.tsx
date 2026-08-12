import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Stethoscope } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../lib/utils';
import type { Doctor } from '../types';

export default function Doctors() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctors', debouncedSearch],
    queryFn: async () => {
      const { data } = await api.get('/doctors', { params: { search: debouncedSearch, limit: 50 } });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isError ? (
        <ErrorState message="Failed to load doctors" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data?.items?.length === 0 ? (
        <EmptyState title="No doctors found" description="Try adjusting your search" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items?.map((doctor: Doctor, idx: number) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="text-teal-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{doctor.user.name}</h3>
                    <p className="text-sm text-slate-500">{doctor.specialization}</p>
                    {doctor.department && (
                      <Badge variant="info" className="mt-2">{doctor.department.name}</Badge>
                    )}
                  </div>
                </div>
                {doctor.bio && <p className="text-sm text-slate-600 mt-3 line-clamp-2">{doctor.bio}</p>}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">Consultation</span>
                  <span className="font-semibold text-teal-700">{formatCurrency(doctor.consultationFee)}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
