import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, Mail, Phone } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency, getStatusColor } from '../lib/utils';
import type { PaginatedResponse, Customer } from '../types';

export default function Customers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Customer>>({
    queryKey: ['customers', page, search, segment],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (segment) params.set('segment', segment);
      const { data } = await api.get(`/customers?${params}`);
      return data;
    },
  });

  if (isError) return <ErrorState message="Failed to load customers" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">Manage customer accounts</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={segment} onChange={(e) => { setSegment(e.target.value); setPage(1); }} className="sm:w-40">
          <option value="">All Segments</option>
          <option value="VIP">VIP</option>
          <option value="REGULAR">Regular</option>
          <option value="NEW">New</option>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : !data?.data?.length ? (
        <EmptyState icon={Users} title="No customers found" description="Customers will appear here" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((customer) => (
            <Card key={customer.id}>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-medium text-foreground">{customer.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {customer.email}
                    </p>
                    {customer.phone && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="accent">{customer.segment}</Badge>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="font-bold text-foreground">{formatCurrency(customer.totalSpend)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-bold text-foreground">{customer._count?.orders || 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-muted-foreground">Page {page} of {data.pagination.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === data.pagination.totalPages} className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
