import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '../../api/hooks';
import { useToastStore } from '../../store/toastStore';
import { PageTransition, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Save, Globe, Hash, Ban } from 'lucide-react';

export default function SettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const { addToast } = useToastStore();

  const [domain, setDomain] = useState('');
  const [codeLength, setCodeLength] = useState(6);
  const [blacklist, setBlacklist] = useState('');

  useEffect(() => {
    if (data) {
      setDomain(data.domain);
      setCodeLength(data.codeLength);
      setBlacklist(data.blacklist.join(', '));
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <SkeletonShimmer className="h-8 w-48 rounded-lg" />
        <SkeletonShimmer className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load settings" onRetry={() => refetch()} />;

  const handleSave = () => {
    updateSettings.mutate(
      {
        domain,
        codeLength,
        blacklist: blacklist.split(',').map((s) => s.trim()).filter(Boolean),
      },
      {
        onSuccess: () => addToast('success', 'Settings saved'),
        onError: () => addToast('error', 'Failed to save'),
      },
    );
  };

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your URL shortener preferences</p>
        </div>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Domain</label>
              <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="localhost" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Code Length</label>
              <Input
                type="number"
                min={4}
                max={12}
                value={codeLength}
                onChange={(e) => setCodeLength(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Ban className="w-4 h-4 text-destructive" /> Blacklist (comma-separated)</label>
              <Input value={blacklist} onChange={(e) => setBlacklist(e.target.value)} placeholder="spam.com, malware.net" />
            </div>
            <Button onClick={handleSave} className="bg-gradient-purple text-white" disabled={updateSettings.isPending}>
              <Save className="w-4 h-4 mr-1" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
