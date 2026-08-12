import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { formatCurrency, getStatusColor, formatDate } from '../lib/utils';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams();

  const { data: product, isLoading, isError, refetch } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  if (isError) return <ErrorState message="Failed to load product details" onRetry={() => refetch()} />;

  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images?.length ? (
              <div className="grid grid-cols-2 gap-3">
                {product.images.map((img) => (
                  <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-secondary">
                    <img src={img.url} alt={img.alt || product.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
      </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{product.description || 'No description'}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.discountPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.discountPrice)}</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="default">
                    <Tag className="mr-1 h-3 w-3" /> {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory & SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-medium text-foreground">{product.stock}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{product.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Slug</p>
                  <p className="font-medium text-foreground">{product.slug}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{formatDate(product.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {product.variants?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 font-medium">SKU</th>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Attributes</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{variant.sku}</td>
                      <td className="py-3 text-foreground">{variant.name}</td>
                      <td className="py-3 text-muted-foreground">
                        {[variant.color, variant.size, variant.material].filter(Boolean).join(' / ') || '—'}
                      </td>
                      <td className="py-3 font-medium text-foreground">{formatCurrency(variant.price)}</td>
                      <td className="py-3">
                        <Badge variant={variant.stock > 0 ? 'success' : 'danger'}>{variant.stock}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
