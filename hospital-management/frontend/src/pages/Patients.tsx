import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, User, Droplet, AlertTriangle } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { calculateAge, getBloodTypeLabel, getGenderLabel } from '../lib/utils';
import type { Patient } from '../types';

export default function Patients() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients', debouncedSearch],
    queryFn: async () => {
      const { data } = await api.get('/patients', { params: { search: debouncedSearch, limit: 50 } });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isError ? (
        <ErrorState message="Failed to load patients" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data?.items?.length === 0 ? (
        <EmptyState title="No patients found" description="Try adjusting your search" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items?.map((patient: Patient, idx: number) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <User className="text-sky-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{patient.user.name}</h3>
                    <p className="text-sm text-slate-500">
                      {calculateAge(patient.dateOfBirth)} yrs · {getGenderLabel(patient.gender)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="danger">
                    <Droplet size={12} className="mr-1" />
                    {getBloodTypeLabel(patient.bloodType)}
                  </Badge>
                  {patient.allergies && (
                    <Badge variant="warning">
                      <AlertTriangle size={12} className="mr-1" />
                      Allergies
                    </Badge>
                  )}
                  {patient.chronicConditions && (
                    <Badge variant="info">Chronic</Badge>
                  )}
                </div>
                {patient.primaryDoctor && (
                  <p className="text-xs text-slate-500 mt-3">
                    Primary doctor: {patient.primaryDoctor.user.name}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
