import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Download, Trash2 } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';
import type { Document, DocumentType, PaginatedResponse } from '../types';

export default function Documents() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<DocumentType>('EMPLOYMENT_CONTRACT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<PaginatedResponse<Document>>({
    queryKey: ['documents', page],
    queryFn: async () => (await api.get('/documents', { params: { page, limit: 12 } })).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: { employeeId: string; type: string; title: string; content?: string }) =>
      api.post('/documents', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast('success', 'Document created');
      setShowForm(false);
      setEmployeeId(''); setTitle(''); setContent('');
    },
    onError: () => toast('error', 'Failed to create document'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast('success', 'Document deleted');
      setDeleteId(null);
    },
    onError: () => toast('error', 'Failed to delete document'),
  });

  const canManage = user?.role === 'HR_ADMIN';

  const handleDownload = async (doc: Document) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast('error', 'Failed to download document');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ employeeId, type, title, content: content || undefined });
  };

  const docTypeColors: Record<string, string> = {
    EMPLOYMENT_CONTRACT: 'var(--color-primary)',
    HIRE_ORDER: 'var(--color-success)',
    LEAVE_ORDER: 'var(--color-warning)',
    CERTIFICATE: 'var(--color-accent)',
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Employee documents and certificates"
        action={canManage && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> New Document</button>}
      />

      {isError ? (
        <ErrorState message="Failed to load documents" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Card key={i}><Skeleton lines={3} /></Card>)}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((doc, i) => (
            <Card key={doc.id} hover delay={i * 0.05}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${docTypeColors[doc.type]}15`, color: docTypeColors[doc.type] }}>
                  <FileText size={20} />
                </div>
                <Badge status={doc.type} label={doc.type.replace(/_/g, ' ')} />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{doc.title}</h3>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {doc.employee.firstName} {doc.employee.lastName} • {formatDate(doc.createdAt)}
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(doc)} className="btn-secondary text-xs flex-1">
                  <Download size={14} /> Download
                </button>
                {canManage && (
                  <button onClick={() => setDeleteId(doc.id)} className="rounded-lg p-2 hover:bg-red-50" style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<FileText size={32} />} title="No documents" description="Create a new document to get started" /></Card>
      )}

      {data && data.items.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Showing {data.items.length} of {data.total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50">Previous</button>
            <button onClick={() => setPage(p => p + 1)} disabled={data.items.length < 12} className="btn-secondary disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Document">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Employee ID</label>
            <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className="input" placeholder="Enter employee ID" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Document Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as DocumentType)} className="input">
              <option value="EMPLOYMENT_CONTRACT">Employment Contract</option>
              <option value="HIRE_ORDER">Hire Order</option>
              <option value="LEAVE_ORDER">Leave Order</option>
              <option value="CERTIFICATE">Certificate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="input" placeholder="Document title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Content (optional)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="input" placeholder="Document content..." />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Document" size="sm">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text)' }}>Are you sure you want to delete this document?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="btn-danger">
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
