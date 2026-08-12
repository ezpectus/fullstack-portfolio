import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { invoicesApi, clientsApi, templatesApi } from '../../api/endpoints';
import type { Template } from '../../types';

interface ItemForm {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemForm[]>([{ description: '', quantity: 1, unit: 'pcs', unitPrice: 0, taxRate: 0, discount: 0 }]);
  const [error, setError] = useState('');

  const { data: clientsData } = useQuery({ queryKey: ['clients', 'all'], queryFn: () => clientsApi.list({ limit: 100 }) });
  const { data: templatesData } = useQuery({ queryKey: ['templates', 'all'], queryFn: () => templatesApi.list({ limit: 100 }) });

  const mutation = useMutation({
    mutationFn: () => invoicesApi.create({ clientId, dueDate, currency, notes, items }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); navigate('/invoices'); },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to create invoice');
    },
  });

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'pcs', unitPrice: 0, taxRate: 0, discount: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof ItemForm, value: string | number) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const addTemplate = (template: Template) => {
    setItems([...items, { description: template.name, quantity: template.quantity, unit: template.unit, unitPrice: template.unitPrice, taxRate: template.taxRate, discount: template.discount }]);
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discountTotal = items.reduce((s, i) => s + i.discount, 0);
  const taxTotal = items.reduce((s, i) => s + (i.quantity * i.unitPrice - i.discount) * (i.taxRate / 100), 0);
  const total = subtotal - discountTotal + taxTotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/invoices" className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">Create Invoice</h1>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3">{error}</div>}

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="input" required>
              <option value="">Select client</option>
              {clientsData?.items.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input">
              <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option>
            </select>
          </div>
        </div>

        {templatesData && templatesData.items.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Quick Add from Templates</label>
            <div className="flex flex-wrap gap-2">
              {templatesData.items.map((t) => (
                <button key={t.id} type="button" onClick={() => addTemplate(t)} className="btn-ghost text-xs border">{t.name}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Items</h2>
          <button onClick={addItem} className="btn-secondary text-sm"><Plus className="w-4 h-4" /> Add Item</button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4"><input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="input" /></div>
              <div className="col-span-1"><input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)} className="input" /></div>
              <div className="col-span-1"><input placeholder="Unit" value={item.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} className="input" /></div>
              <div className="col-span-2"><input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} className="input" /></div>
              <div className="col-span-1"><input type="number" placeholder="Tax%" value={item.taxRate} onChange={(e) => updateItem(i, 'taxRate', parseFloat(e.target.value) || 0)} className="input" /></div>
              <div className="col-span-2"><input type="number" placeholder="Disc" value={item.discount} onChange={(e) => updateItem(i, 'discount', parseFloat(e.target.value) || 0)} className="input" /></div>
              <div className="col-span-1">{items.length > 1 && <button onClick={() => removeItem(i)} className="btn-ghost text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input min-h-[80px]" placeholder="Optional notes for the client" />
        </div>
        <div className="ml-auto max-w-xs space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span>-{discountTotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{taxTotal.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span className="text-primary-600">{total.toFixed(2)} {currency}</span></div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to="/invoices" className="btn-secondary">Cancel</Link>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => mutation.mutate()} disabled={mutation.isPending || !clientId || !dueDate} className="btn-primary">
          {mutation.isPending ? 'Creating...' : 'Create Invoice'}
        </motion.button>
      </div>
    </div>
  );
}
