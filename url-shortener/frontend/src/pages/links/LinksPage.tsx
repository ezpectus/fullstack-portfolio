import { useState } from 'react';
import { useLinks, useCreateLink, useDeleteLink } from '../../api/hooks';
import { useToastStore } from '../../store/toastStore';
import { PageTransition, StaggerList, StaggerItem, SkeletonShimmer, ModalAnimation, MotionButton } from '../../components/animations/MotionComponents';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Search, Trash2, ExternalLink, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LinksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newAlias, setNewAlias] = useState('');

  const { data, isLoading, isError, refetch } = useLinks({ page, search, status: statusFilter, limit: 10 });
  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();
  const { addToast } = useToastStore();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createLink.mutate(
      { originalUrl: newUrl, alias: newAlias || undefined },
      {
        onSuccess: () => {
          addToast('success', 'Link created!');
          setShowCreate(false);
          setNewUrl('');
          setNewAlias('');
        },
        onError: () => addToast('error', 'Failed to create link'),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this link?')) return;
    deleteLink.mutate(id, {
      onSuccess: () => addToast('success', 'Link deleted'),
      onError: () => addToast('error', 'Failed to delete'),
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast('success', 'Copied to clipboard');
  };

  if (isError) return <ErrorState message="Failed to load links" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Links</h1>
            <p className="text-muted-foreground mt-1">Manage your shortened URLs</p>
          </div>
          <MotionButton
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-md bg-gradient-purple text-white font-medium shadow-neon flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Link
          </MotionButton>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
              placeholder="Search links..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonShimmer key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <StaggerList className="space-y-3">
            {data?.items?.map((link) => (
              <StaggerItem key={link.id}>
                <Card className="glass-card hover:neon-border transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <Link to={`/links/${link.id}`} className="block">
                        <p className="font-medium text-primary hover:underline">{link.shortUrl ?? link.shortCode}</p>
                        <p className="text-sm text-muted-foreground truncate">{link.originalUrl}</p>
                      </Link>
                    </div>
                    <Badge variant={link.status === 'active' ? 'success' : 'secondary'}>{link.status}</Badge>
                    {link._count && <span className="text-sm text-muted-foreground">{link._count.clicks} clicks</span>}
                    <div className="flex gap-1">
                      <button onClick={() => copyUrl(link.shortUrl ?? link.shortCode)} className="p-2 rounded-lg hover:bg-white/5">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <a href={link.shortUrl ?? link.shortCode} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                      <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )) ?? <p className="text-muted-foreground text-center py-8">No links found</p>}
          </StaggerList>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}

        <ModalAnimation isOpen={showCreate}>
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
              <Card className="w-full max-w-md glass-card neon-border m-4" onClick={(e) => e.stopPropagation()}>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold gradient-text">Create Short Link</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL</label>
                      <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom Alias (optional)</label>
                      <Input value={newAlias} onChange={(e) => setNewAlias(e.target.value)} placeholder="my-link" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1 bg-gradient-purple text-white" disabled={createLink.isPending}>
                        {createLink.isPending ? 'Creating...' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </ModalAnimation>
      </div>
    </PageTransition>
  );
}
