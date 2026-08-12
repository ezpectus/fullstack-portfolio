import { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '../components/ui/EmptyState';
import type { Booking } from '../types';

export default function Calendar() {
  const [view, setView] = useState<'month' | 'week'>('week');

  const { data: bookings, isError, refetch } = useQuery({
    queryKey: ['bookings', 'calendar'],
    queryFn: async () => {
      const res = await api.get('/bookings', { params: { limit: '100' } });
      return res.data.data;
    },
  });

  if (isError) return <ErrorState message="Failed to load calendar data" onRetry={() => refetch()} />;

  const events = (bookings || []).map((b: Booking) => ({
    id: b.id,
    title: `${b.service?.name || 'Booking'} — ${b.customer?.name || ''}`,
    start: b.startTime,
    end: b.endTime,
    backgroundColor: b.status === 'CONFIRMED' ? 'hsl(14 90% 55%)' : b.status === 'PENDING' ? 'hsl(45 90% 55%)' : b.status === 'CANCELLED' ? 'hsl(0 84% 60%)' : 'hsl(140 70% 45%)',
    borderColor: 'transparent',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calendar</h2>
        <p className="text-sm text-muted-foreground">View and manage bookings in calendar</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setView('week')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${view === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${view === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Month
          </button>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view === 'week' ? 'timeGridWeek' : 'dayGridMonth'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          events={events}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          nowIndicator
          eventDisplay="block"
          eventContent={(arg) => (
            <div className="px-1 py-0.5 text-xs text-white overflow-hidden">
              <p className="font-medium truncate">{arg.event.title}</p>
            </div>
          )}
        />
      </motion.div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Legend</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Confirmed', color: 'hsl(14 90% 55%)' },
            { label: 'Pending', color: 'hsl(45 90% 55%)' },
            { label: 'Completed', color: 'hsl(140 70% 45%)' },
            { label: 'Cancelled', color: 'hsl(0 84% 60%)' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
