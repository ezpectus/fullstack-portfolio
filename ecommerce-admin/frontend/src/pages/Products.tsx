import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToastStore } from '../store/toastStore';
import { formatCurrency, getStatusColor } from '../lib/utils';
import type { PaginatedResponse, Product } from '../types';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', page, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast('Product deleted', 'success');
    },
    onError: () => addToast('Failed to delete product', 'error'),
  });

  if (isError) return <ErrorState message="Failed to load products" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-40">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Start adding products to your catalog"
          action={<Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((product) => (
            <Card key={product.id} className="group overflow-hidden p-0 transition-shadow hover:shadow-md">
              <div className="relative aspect-square overflow-hidden rounded-t-lg bg-secondary">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="truncate font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                    {product.discountPrice && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">{formatCurrency(product.discountPrice)}</span>
                    )}
                  </div>
                  <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out'}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link to={`/products/${product.id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-3 w-3" /></Button>
                  </Link>
                  <Button variant="outline" size="sm"><Pencil className="h-3 w-3" /></Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
