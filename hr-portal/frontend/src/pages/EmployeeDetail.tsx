import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Building2, Calendar, GraduationCap, Briefcase, Wrench } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/Card';
import { Badge, Skeleton } from '../components/UI';
import { ErrorState } from '../components/ui/EmptyState';
import { formatDate, formatCurrency, getInitials } from '../lib/utils';
import type { Employee } from '../types';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading, isError, refetch } = useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: async () => (await api.get(`/employees/${id}`)).data,
    enabled: !!id,
  });

  if (isError) return <ErrorState message="Failed to load employee details" onRetry={() => refetch()} />;
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card><Skeleton lines={6} /></Card>
      </div>
    );
  }

  if (!emp) return null;

  const infoItems = [
    { icon: <Mail size={18} />, label: 'Email', value: emp.user.email },
    { icon: <Phone size={18} />, label: 'Phone', value: emp.phone || 'N/A' },
    { icon: <Building2 size={18} />, label: 'Department', value: emp.department?.name || 'N/A' },
    { icon: <Calendar size={18} />, label: 'Hire Date', value: formatDate(emp.hireDate) },
    { icon: <Calendar size={18} />, label: 'Date of Birth', value: formatDate(emp.dateOfBirth) },
    { icon: <Briefcase size={18} />, label: 'Position', value: emp.position },
    { icon: <GraduationCap size={18} />, label: 'Education', value: emp.education || 'N/A' },
    { icon: <Briefcase size={18} />, label: 'Experience', value: emp.experience || 'N/A' },
    { icon: <Wrench size={18} />, label: 'Skills', value: emp.skills || 'N/A' },
  ];

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-4">
        <ArrowLeft size={18} /> Back
      </button>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
            {getInitials(`${emp.firstName} ${emp.lastName}`)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{emp.firstName} {emp.lastName}</h1>
              <Badge status={emp.status} />
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{emp.position} • {emp.department?.name || 'Unassigned'}</p>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span>Salary: <strong style={{ color: 'var(--color-text)' }}>{formatCurrency(emp.salary)}</strong></span>
              <span>Manager: <strong style={{ color: 'var(--color-text)' }}>{emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : 'N/A'}</strong></span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Personal Information</h3>
          <div className="space-y-4">
            {infoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span style={{ color: 'var(--color-text-muted)' }}>{item.icon}</span>
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {emp.subordinates && emp.subordinates.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Subordinates ({emp.subordinates.length})</h3>
              <div className="space-y-2">
                {emp.subordinates.map((sub) => (
                  <Link key={sub.id} to={`/employees/${sub.id}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                      {getInitials(`${sub.firstName} ${sub.lastName}`)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{sub.firstName} {sub.lastName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub.position}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
