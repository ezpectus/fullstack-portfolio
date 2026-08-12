import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useDeals, useUpdateDeal, useCreateDeal } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { Plus, GripVertical } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Deal } from '@/types';

const STAGES: { key: Deal['stage']; label: string; color: string }[] = [
  { key: 'new', label: 'New', color: 'bg-blue-500' },
  { key: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { key: 'qualified', label: 'Qualified', color: 'bg-indigo-500' },
  { key: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
  { key: 'won', label: 'Won', color: 'bg-green-500' },
  { key: 'lost', label: 'Lost', color: 'bg-red-500' },
];

const dragVariants: Variants = {
  resting: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  dragging: {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

export default function DealsPage() {
  const toast = useToast();
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: '', amount: 0, customerId: '', stage: 'new' as Deal['stage'] });

  const { data, isLoading, isError, refetch } = useDeals({ limit: 100 });
  const updateDeal = useUpdateDeal();
  const createDeal = useCreateDeal();

  const shouldReduceMotion = useReducedMotion();

  if (isError) return <ErrorState message="Failed to load deals" onRetry={() => refetch()} />;

  const deals = data?.data ?? [];

  const handleDragStart = (deal: Deal) => setDraggedDeal(deal);

  const handleDrop = async (stage: Deal['stage']) => {
    if (!draggedDeal || draggedDeal.stage === stage) {
      setDraggedDeal(null);
      return;
    }
    try {
      await updateDeal.mutateAsync({ id: draggedDeal.id, data: { stage } });
      toast.success(`Deal moved to ${stage}`);
    } catch {
      toast.error('Failed to update deal');
    }
    setDraggedDeal(null);
  };

  const handleCreate = async () => {
    if (!newDeal.title || !newDeal.customerId) {
      toast.error('Title and customer are required');
      return;
    }
    try {
      await createDeal.mutateAsync(newDeal);
      toast.success('Deal created');
      setCreateOpen(false);
      setNewDeal({ title: '', amount: 0, customerId: '', stage: 'new' });
    } catch {
      toast.error('Failed to create deal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deals Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag and drop deals between stages</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-6">
          {STAGES.map((s) => (
            <div key={s.key} className="h-96 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <EmptyState
          icon="deals"
          title="No deals yet"
          description="Create your first deal to start tracking your pipeline"
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-6 overflow-x-auto">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            return (
              <div
                key={stage.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage.key)}
                className="rounded-lg border bg-card p-3 min-w-[200px]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{stageDeals.length}</span>
                </div>
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      variants={shouldReduceMotion ? undefined : dragVariants}
                      initial="resting"
                      animate="resting"
                      whileDrag={shouldReduceMotion ? undefined : 'dragging'}
                      draggable={!shouldReduceMotion}
                      onDragStart={() => handleDragStart(deal)}
                      className="cursor-grab rounded-md border bg-background p-3 active:cursor-grabbing"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="text-sm font-medium">{deal.title}</span>
                        {!shouldReduceMotion && <GripVertical className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {deal.customer?.name ?? '—'}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold">{formatCurrency(deal.amount, deal.currency)}</span>
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </motion.div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="rounded-md border border-dashed py-8 text-center text-xs text-muted-foreground">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Deal"
        description="Add a new deal to your pipeline"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              placeholder="Deal title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer ID</label>
            <Input
              value={newDeal.customerId}
              onChange={(e) => setNewDeal({ ...newDeal, customerId: e.target.value })}
              placeholder="Customer UUID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={newDeal.amount}
              onChange={(e) => setNewDeal({ ...newDeal, amount: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createDeal.isPending}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
