import { useState } from 'react';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/api/hooks';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { StaggerList, StaggerItem } from '@/components/animations/MotionComponents';
import { Plus, Pin, PinOff, Trash2, Edit } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { Note } from '@/types';

export default function NotesPage() {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [dealId, setDealId] = useState('');

  const { data, isLoading, isError, refetch } = useNotes({ limit: 50 });
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();

  if (isError) return <ErrorState message="Failed to load notes" onRetry={() => refetch()} />;

  const notes = data?.data ?? [];

  const handleCreate = async () => {
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    try {
      await createMutation.mutateAsync({
        content,
        customerId: customerId || undefined,
        dealId: dealId || undefined,
      });
      toast.success('Note created');
      setCreateOpen(false);
      setContent('');
      setCustomerId('');
      setDealId('');
    } catch {
      toast.error('Failed to create note');
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await updateMutation.mutateAsync({ id: note.id, data: { isPinned: !note.isPinned } });
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch {
      toast.error('Failed to update note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleUpdate = async () => {
    if (!editNote || !content.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: editNote.id, data: { content } });
      toast.success('Note updated');
      setEditNote(null);
      setContent('');
    } catch {
      toast.error('Failed to update note');
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-sm text-muted-foreground">All your notes across customers and deals</p>
        </div>
        <Button size="sm" onClick={() => { setContent(''); setCreateOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : sortedNotes.length === 0 ? (
            <EmptyState
              icon="notes"
              title="No notes yet"
              description="Create your first note to keep track of important information"
              action={
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              }
            />
          ) : (
            <StaggerList className="space-y-3">
              {sortedNotes.map((note) => (
                <StaggerItem key={note.id}>
                  <div className={`rounded-md border p-4 ${note.isPinned ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {note.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
                        <span className="text-xs text-muted-foreground">
                          {note.createdBy?.name ?? 'Unknown'} · {formatDateTime(note.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleTogglePin(note)}>
                          {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditNote(note); setContent(note.content); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{note.content}</p>
                    <div className="mt-2 flex gap-2">
                      {note.customer && (
                        <Badge variant="outline" className="text-xs">
                          {note.customer.name}
                        </Badge>
                      )}
                      {note.deal && (
                        <Badge variant="outline" className="text-xs">
                          {note.deal.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Note"
        description="Add a note about a customer or deal"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer ID (optional)</label>
              <Input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="UUID" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deal ID (optional)</label>
              <Input value={dealId} onChange={(e) => setDealId(e.target.value)} placeholder="UUID" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>Create</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editNote}
        onClose={() => { setEditNote(null); setContent(''); }}
        title="Edit Note"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setEditNote(null); setContent(''); }}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
