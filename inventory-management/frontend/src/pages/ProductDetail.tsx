import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams();

  const { data: product, isLoading, isError, refetch } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (isError) return <ErrorState message="Failed to load product details" onRetry={() => refetch()} />;
  if (!product) return <div className="p-8 text-center text-muted-foreground">Product not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/products">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{product.category?.name || 'Uncategorized'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unit</p>
                <p className="text-sm font-medium">{product.unit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cost Price</p>
                <p className="text-sm font-medium">{formatCurrency(product.costPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sell Price</p>
                <p className="text-sm font-medium">{formatCurrency(product.sellPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Min Stock</p>
                <Badge variant={product.minStock > 0 ? 'warning' : 'secondary'}>{product.minStock}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Barcode</p>
                <p className="text-sm font-medium font-mono">{product.barcode || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="text-sm font-medium">{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
