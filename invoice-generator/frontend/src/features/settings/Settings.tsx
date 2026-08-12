import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { companyApi } from '../../api/endpoints';
import type { Company } from '../../types';
import { Skeleton } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToastStore } from '../../store/toastStore';
import { Save } from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const { data: company, isLoading, isError, refetch } = useQuery({ queryKey: ['company'], queryFn: companyApi.get });

  const [form, setForm] = useState<Partial<Company> | null>(null);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Company>) => companyApi.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['company'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to save settings', 'error');
      console.error('Save settings error:', error);
    },
  });

  if (isLoading) return <div className="p-6"><Skeleton className="h-96" /></div>;
  if (isError) return <div className="p-6"><ErrorState message="Failed to load company settings" onRetry={() => refetch()} /></div>;

  const current = form || company;
  const set = (field: keyof Company, value: string) => setForm({ ...current, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form || company || {});
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Company Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name</label><input value={current?.name || ''} onChange={(e) => set('name', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input value={current?.email || ''} onChange={(e) => set('email', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input value={current?.phone || ''} onChange={(e) => set('phone', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Tax ID</label><input value={current?.taxId || ''} onChange={(e) => set('taxId', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Address</label><input value={current?.address || ''} onChange={(e) => set('address', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">City</label><input value={current?.city || ''} onChange={(e) => set('city', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Country</label><input value={current?.country || ''} onChange={(e) => set('country', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Postal Code</label><input value={current?.postalCode || ''} onChange={(e) => set('postalCode', e.target.value)} className="input" /></div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Bank Name</label><input value={current?.bankName || ''} onChange={(e) => set('bankName', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Account Number</label><input value={current?.bankAccount || ''} onChange={(e) => set('bankAccount', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">SWIFT</label><input value={current?.bankSwift || ''} onChange={(e) => set('bankSwift', e.target.value)} className="input" /></div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Invoice Prefix</label><input value={current?.invoicePrefix || ''} onChange={(e) => set('invoicePrefix', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Invoice Start Number</label><input type="number" value={current?.invoiceStart || 0} onChange={(e) => set('invoiceStart', e.target.value)} className="input" /></div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Email Template</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Email Subject</label><input value={current?.emailSubject || ''} onChange={(e) => set('emailSubject', e.target.value)} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Email Body</label><textarea value={current?.emailBody || ''} onChange={(e) => set('emailBody', e.target.value)} className="input min-h-32" /></div>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={updateMutation.isPending} className="btn-primary">
            <Save size={16} /> {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
