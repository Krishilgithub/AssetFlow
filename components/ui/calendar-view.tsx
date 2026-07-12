"use client";

import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  status: string;
}

interface CalendarViewProps {
  events: BookingEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = (event: BookingEvent) => {
    let backgroundColor = '#000000';
    if (event.status === 'Cancelled') backgroundColor = '#ef4444'; // red-500
    if (event.status === 'Completed') backgroundColor = '#10b981'; // emerald-500

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="h-[600px] w-full bg-white p-4 rounded-xl border border-neutral-200">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        tooltipAccessor="title"
      />
    </div>
  );
}
