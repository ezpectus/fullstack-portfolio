import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer, useNotes } from '@/api/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState, EmptyState } from '@/components/ui/EmptyState';
import { ScrollReveal, StaggerList, StaggerItem } from '@/components/animations/MotionComponents';
import { ArrowLeft, Mail, Phone, Building, Tag, Pin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  lead: 'warning',
  active: 'success',
  inactive: 'secondary',
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError, refetch } = useCustomer(id!);
  const { data: notesData } = useNotes({ customerId: id });

  if (isLoading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  if (isError) return <ErrorState message="Customer not found" onRetry={() => refetch()} />;

  const notes = notesData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{customer?.name}</h1>
          <p className="text-sm text-muted-foreground">Customer details</p>
        </div>
        <Badge variant={statusVariant[customer?.status ?? 'lead'] ?? 'default'}>
          {customer?.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info */}
        <ScrollReveal className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer?.email ?? '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer?.phone ?? '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer?.company ?? '—'}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {customer?.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="border-t pt-3 text-xs text-muted-foreground">
                <p>Created: {customer && formatDate(customer.createdAt)}</p>
                <p>Updated: {customer && formatDate(customer.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Notes */}
        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <EmptyState icon="notes" title="No notes yet" description="Notes about this customer will appear here" />
              ) : (
                <StaggerList className="space-y-3">
                  {notes.map((note) => (
                    <StaggerItem key={note.id}>
                      <div className="rounded-md border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {note.createdBy?.name ?? 'Unknown'} · {formatDate(note.createdAt)}
                          </span>
                          {note.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
