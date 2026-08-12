import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { useToastStore } from '../store/toastStore';
import type { Settings as SettingsType } from '../types';

export default function Settings() {
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading, isError, refetch } = useQuery<SettingsType[]>({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data.data,
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: { settings: { key: string; value: string }[] }) => api.put('/settings/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast('Settings saved', 'success');
    },
    onError: () => addToast('Failed to save settings', 'error'),
  });

  const handleSave = () => {
    const settingsArr = Object.entries(values).map(([key, value]) => ({ key, value }));
    saveMutation.mutate({ settings: settingsArr });
  };

  if (isLoading) return <Skeleton className="h-96" />;
  if (isError) return <ErrorState message="Failed to load settings" onRetry={() => refetch()} />;

  const fields = [
    { key: 'store_name', label: 'Store Name', type: 'text' },
    { key: 'store_email', label: 'Store Email', type: 'email' },
    { key: 'store_phone', label: 'Store Phone', type: 'tel' },
    { key: 'default_currency', label: 'Default Currency', type: 'text' },
    { key: 'tax_rate', label: 'Tax Rate', type: 'text' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                <Input
                  type={field.type}
                  value={values[field.key] || ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
