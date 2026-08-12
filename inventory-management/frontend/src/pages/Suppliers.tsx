import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Truck, Mail, Phone, Search } from 'lucide-react';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Supplier, PaginatedResponse } from '@/types';

export default function Suppliers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Supplier>>({
    queryKey: ['suppliers', page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      return (await api.get('/suppliers', { params })).data;
    },
  });

  if (isError) return <ErrorState message="Failed to load suppliers" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage your suppliers</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Add Supplier</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search suppliers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : data?.items?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((supplier, i) => (
            <motion.div key={supplier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{supplier.name}</h3>
                  </div>
                  {supplier.contact && <p className="text-sm text-muted-foreground mb-1">Contact: {supplier.contact}</p>}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Mail className="h-3 w-3" />{supplier.email}
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />{supplier.phone}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card><CardContent className="p-8 text-center">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No suppliers found</p>
        </CardContent></Card>
      )}
    </div>
  );
}
