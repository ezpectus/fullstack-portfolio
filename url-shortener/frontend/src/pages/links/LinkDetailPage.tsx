import { useParams, Link } from 'react-router-dom';
import { useLink, useUpdateLink, useDeleteLink } from '../../api/hooks';
import { useToastStore } from '../../store/toastStore';
import { PageTransition, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft, Copy, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LinkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: link, isLoading, isError, refetch } = useLink(id!);
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const { addToast } = useToastStore();

  const [status, setStatus] = useState('');
  const [alias, setAlias] = useState('');

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <SkeletonShimmer className="h-8 w-48 rounded-lg" />
        <SkeletonShimmer className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load link details" onRetry={() => refetch()} />;

  if (!link) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Link not found</p>
        <Link to="/links" className="text-primary hover:underline">Back to links</Link>
      </div>
    );
  }

  const handleUpdate = () => {
    updateLink.mutate(
      { id: link.id, status: status || undefined, alias: alias || undefined },
      {
        onSuccess: () => addToast('success', 'Link updated'),
        onError: () => addToast('error', 'Update failed'),
      },
    );
  };

  const handleDelete = () => {
    if (!confirm('Delete this link?')) return;
    deleteLink.mutate(link.id, {
      onSuccess: () => {
        addToast('success', 'Link deleted');
        window.location.href = '/links';
      },
    });
  };

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <Link to="/links" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Links
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{link.shortCode}</h1>
            <p className="text-muted-foreground mt-1 truncate max-w-xl">{link.originalUrl}</p>
          </div>
          <Badge variant={link.status === 'active' ? 'success' : 'secondary'}>{link.status}</Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(link.shortUrl ?? link.shortCode); addToast('success', 'Copied'); }}>
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
          <a href={link.shortUrl ?? link.shortCode} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" /> Open
            </Button>
          </a>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Edit Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Alias</label>
              <Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder={link.alias ?? 'No alias'} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Keep current ({link.status})</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button onClick={handleUpdate} className="bg-gradient-purple text-white" disabled={updateLink.isPending}>
              {updateLink.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(link.createdAt).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Updated</span><span>{new Date(link.updatedAt).toLocaleString()}</span></div>
            {link._count && <div className="flex justify-between"><span className="text-muted-foreground">Total Clicks</span><span>{link._count.clicks}</span></div>}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
