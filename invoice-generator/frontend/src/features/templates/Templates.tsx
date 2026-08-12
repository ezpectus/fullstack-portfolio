import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { templatesApi } from '../../api/endpoints';
import type { Template } from '../../types';
import { StaggerContainer, StaggerItem, Skeleton } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToastStore } from '../../store/toastStore';
import { Plus, Trash2, Edit3 } from 'lucide-react';

export default function Templates() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [unitPrice, setUnitPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['templates'], queryFn: () => templatesApi.list({ limit: 100 }) });

  if (isError) return <ErrorState message="Failed to load templates" onRetry={() => refetch()} />;

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<Template>) => editId ? templatesApi.update(editId, payload) : templatesApi.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['templates'] }); resetForm(); },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to save template', 'error');
      console.error('Save template error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templatesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
    onError: (error: unknown) => {
      useToastStore.getState().addToast('Failed to delete template', 'error');
      console.error('Delete template error:', error);
    },
  });

  const resetForm = () => {
    setShowForm(false); setEditId(null); setName(''); setDescription(''); setQuantity(1); setUnit('pcs'); setUnitPrice(0); setTaxRate(0); setDiscount(0);
  };

  const openEdit = (t: Template) => {
    setEditId(t.id); setName(t.name); setDescription(t.description); setQuantity(t.quantity); setUnit(t.unit); setUnitPrice(t.unitPrice); setTaxRate(t.taxRate); setDiscount(t.discount); setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name, description, quantity: Number(quantity), unit, unitPrice: Number(unitPrice), taxRate: Number(taxRate), discount: Number(discount) });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Template</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Template' : 'New Template'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="input" required /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium mb-1">Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input" min={0} step="any" /></div>
                <div><label className="block text-sm font-medium mb-1">Unit</label><input value={unit} onChange={(e) => setUnit(e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium mb-1">Unit Price</label><input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} className="input" min={0} step="any" /></div>
                <div><label className="block text-sm font-medium mb-1">Tax Rate %</label><input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="input" min={0} step="any" /></div>
                <div><label className="block text-sm font-medium mb-1">Discount</label><input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="input" min={0} step="any" /></div>
                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saveMutation.isPending} className="btn-primary">{saveMutation.isPending ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items?.map((t) => (
              <StaggerItem key={t.id}>
                <motion.div whileHover={{ y: -2 }} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{t.name}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-primary-600"><Edit3 size={14} /></button>
                      <button onClick={() => deleteMutation.mutate(t.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {t.description && <p className="text-sm text-gray-500 mb-3">{t.description}</p>}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Qty: {t.quantity} {t.unit}</span>
                    <span>Price: ${t.unitPrice}</span>
                    <span>Tax: {t.taxRate}%</span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
}
