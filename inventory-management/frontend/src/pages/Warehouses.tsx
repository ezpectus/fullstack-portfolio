import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Warehouse as WarehouseIcon, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Warehouse, PaginatedResponse } from '@/types';

export default function Warehouses() {
  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Warehouse>>({
    queryKey: ['warehouses'],
    queryFn: async () => (await api.get('/warehouses')).data,
  });

  if (isError) return <ErrorState message="Failed to load warehouses" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground mt-1">Manage your warehouse locations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : data?.items?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((warehouse, i) => (
            <motion.div
              key={warehouse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <WarehouseIcon className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{warehouse.name}</h3>
                  </div>
                  {warehouse.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {warehouse.address}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <WarehouseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No warehouses found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
