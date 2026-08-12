import { useState } from 'react';
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '../../api/hooks';
import { useToastStore } from '../../store/toastStore';
import { PageTransition, StaggerList, StaggerItem, SkeletonShimmer, ModalAnimation, MotionButton } from '../../components/animations/MotionComponents';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Trash2, Key, Copy } from 'lucide-react';

export default function ApiKeysPage() {
  const { data, isLoading, isError, refetch } = useApiKeys();
  const createKey = useCreateApiKey();
  const deleteKey = useDeleteApiKey();
  const { addToast } = useToastStore();

  const [showCreate, setShowCreate] = useState(false);
  const [keyName, setKeyName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createKey.mutate(
      { name: keyName },
      {
        onSuccess: () => {
          addToast('success', 'API key created');
          setShowCreate(false);
          setKeyName('');
        },
        onError: () => addToast('error', 'Failed to create key'),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this API key?')) return;
    deleteKey.mutate(id, {
      onSuccess: () => addToast('success', 'Key deleted'),
      onError: () => addToast('error', 'Failed to delete'),
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addToast('success', 'Copied');
  };

  if (isError) return <ErrorState message="Failed to load API keys" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">API Keys</h1>
            <p className="text-muted-foreground mt-1">Manage keys for API access</p>
          </div>
          <MotionButton
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-md bg-gradient-purple text-white font-medium shadow-neon flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Key
          </MotionButton>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonShimmer key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <StaggerList className="space-y-3">
            {data?.map((apiKey) => (
              <StaggerItem key={apiKey.id}>
                <Card className="glass-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{apiKey.name}</p>
                      <p className="text-sm text-muted-foreground font-mono truncate">{apiKey.key}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsedAt && ` · Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <button onClick={() => copyKey(apiKey.key)} className="p-2 rounded-lg hover:bg-white/5">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(apiKey.id)} className="p-2 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </CardContent>
                </Card>
              </StaggerItem>
            )) ?? <p className="text-muted-foreground text-center py-8">No API keys yet</p>}
          </StaggerList>
        )}

        <ModalAnimation isOpen={showCreate}>
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
              <Card className="w-full max-w-md glass-card neon-border m-4" onClick={(e) => e.stopPropagation()}>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold gradient-text">Create API Key</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="My API Key" required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1 bg-gradient-purple text-white" disabled={createKey.isPending}>
                        {createKey.isPending ? 'Creating...' : 'Create'}
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
