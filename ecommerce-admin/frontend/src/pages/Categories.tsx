import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderTree, Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToastStore } from '../store/toastStore';
import type { Category } from '../types';

export default function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const { data: categories, isLoading, isError, refetch } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; parentId?: string }) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category created', 'success');
      setShowForm(false);
      setName('');
      setParentId('');
    },
    onError: () => addToast('Failed to create category', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category deleted', 'success');
    },
    onError: () => addToast('Failed to delete category', 'error'),
  });

  if (isError) return <ErrorState message="Failed to load categories" onRetry={() => refetch()} />;

  const renderTree = (cats: Category[], level = 0) => (
    <>
      {cats.map((cat) => (
        <div key={cat.id}>
          <div
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-secondary"
            style={{ paddingLeft: `${level * 24 + 12}px` }}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat._count?.products || 0} products</span>
            <Button variant="ghost" size="sm"><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(cat.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          {cat.children?.length ? renderTree(cat.children, level + 1) : null}
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ name, parentId: parentId || undefined }); }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-foreground">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              >
                <option value="">None (Root)</option>
                {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !categories?.length ? (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Create categories to organize your products"
        />
      ) : (
        <Card className="p-2">
          {renderTree(categories)}
        </Card>
      )}
    </div>
  );
}
