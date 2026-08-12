import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, FolderTree } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Category } from '@/types';

export default function Categories() {
  const { data: categories, isLoading, isError, refetch } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });

  if (isError) return <ErrorState message="Failed to load categories" onRetry={() => refetch()} />;

  const renderTree = (cats: Category[], level = 0) => (
    <div className={level > 0 ? 'ml-6 border-l pl-4' : ''}>
      {cats.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="py-2"
        >
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{cat.name}</span>
          </div>
          {cat.children && cat.children.length > 0 && renderTree(cat.children, level + 1)}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : categories?.length ? (
            renderTree(categories)
          ) : (
            <p className="text-muted-foreground">No categories found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
