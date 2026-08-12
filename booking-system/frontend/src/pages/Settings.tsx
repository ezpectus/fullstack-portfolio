import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Building, Clock, Mail } from 'lucide-react';
import api from '../lib/api';
import { useToastStore } from '../store/toastStore';
import { ErrorState } from '../components/ui/EmptyState';
import type { Settings } from '../types';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [form, setForm] = useState<Settings>({});

  const { isError, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      const settings: Settings = {};
      res.data.data.forEach((s: { key: string; value: string }) => { settings[s.key] = s.value; });
      setForm(settings);
      return res.data.data;
    },
  });

  if (isError) return <ErrorState message="Failed to load settings" onRetry={() => refetch()} />;

  const updateSettings = useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      await api.put('/settings/bulk', { settings });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast('Settings saved successfully');
    },
  });

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
    updateSettings.mutate(settings);
  };

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sections = [
    {
      title: 'Business Information',
      icon: Building,
      fields: [
        { key: 'business_name', label: 'Business Name', type: 'text', placeholder: 'BookingHub Spa' },
        { key: 'business_email', label: 'Business Email', type: 'email', placeholder: 'contact@bookinghub.com' },
        { key: 'business_phone', label: 'Business Phone', type: 'tel', placeholder: '+1 234 567 890' },
        { key: 'business_address', label: 'Address', type: 'text', placeholder: '123 Main St, City' },
      ],
    },
    {
      title: 'Booking Configuration',
      icon: Clock,
      fields: [
        { key: 'timezone', label: 'Timezone', type: 'text', placeholder: 'America/New_York' },
        { key: 'slot_buffer_minutes', label: 'Buffer Between Slots (min)', type: 'number', placeholder: '15' },
        { key: 'min_booking_notice_hours', label: 'Min Booking Notice (hours)', type: 'number', placeholder: '2' },
        { key: 'max_booking_days', label: 'Max Advance Booking (days)', type: 'number', placeholder: '30' },
        { key: 'cancellation_policy_hours', label: 'Cancellation Policy (hours)', type: 'number', placeholder: '24' },
      ],
    },
    {
      title: 'Email Notifications',
      icon: Mail,
      fields: [
        { key: 'smtp_from_name', label: 'From Name', type: 'text', placeholder: 'BookingHub' },
        { key: 'smtp_from_email', label: 'From Email', type: 'email', placeholder: 'noreply@bookinghub.com' },
        { key: 'notification_lead_time_hours', label: 'Reminder Lead Time (hours)', type: 'number', placeholder: '2' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your booking system</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save size={16} /> {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <section.icon size={18} />
              </div>
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key] || ''}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
