import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Plus, Trash2, Pencil, Calendar } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToastStore } from '../store/toastStore';
import { formatCurrency, formatDate } from '../lib/utils';
import type { PaginatedResponse, PromoCode } from '../types';

export default function PromoCodes() {
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<PromoCode>>({
    queryKey: ['promo-codes'],
    queryFn: async () => {
      const { data } = await api.get('/promo-codes?limit=50');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/promo-codes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      addToast('Promo code created', 'success');
      setShowForm(false);
      setCode(''); setValue(''); setMinOrder('0');
    },
    onError: () => addToast('Failed to create promo code', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/promo-codes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      addToast('Promo code deleted', 'success');
    },
    onError: () => addToast('Failed to delete promo code', 'error'),
  });

  if (isError) return <ErrorState message="Failed to load promo codes" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promo Codes</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> Add Code
        </Button>
      </div>

      {showForm && (
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({
                code, type, value: parseFloat(value),
                minOrderValue: parseFloat(minOrder), isActive: true,
              });
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Code</label>
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SAVE10" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Type</label>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Value</label>
              <Input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="10" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Min Order Value</label>
              <Input type="number" step="0.01" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit">Create Promo Code</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : !data?.data?.length ? (
        <EmptyState icon={Ticket} title="No promo codes" description="Create discount codes for your customers" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((promo) => (
            <Card key={promo.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{promo.code}</h3>
                    <Badge variant={promo.isActive ? 'success' : 'danger'}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}% off` : `${formatCurrency(promo.value)} off`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(promo.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Min Order</p>
                  <p className="font-medium text-foreground">{formatCurrency(promo.minOrderValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Used</p>
                  <p className="font-medium text-foreground">
                    {promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}
                  </p>
                </div>
                {promo.expiresAt && (
                  <div className="col-span-2">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Expires {formatDate(promo.expiresAt)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
