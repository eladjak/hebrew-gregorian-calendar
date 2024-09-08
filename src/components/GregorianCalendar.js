import React, { useEffect, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { HDate, gematriya } from '@hebcal/core';

const CalendarWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #f3f4f6, #ffffff)',
}));

const GregorianCalendar = ({ events, onEventClick, onDateClick, view }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log('View changed to:', view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(() => {
        calendarApi.changeView(view);
      }, 0);
    }
  }, [view]);

  const renderHebrewDate = useCallback((date) => {
    const hDate = new HDate(date);
    return `${gematriya(hDate.getDate())} ${hDate.getMonthName('h')}`;
  }, []);

  return (
    <CalendarWrapper>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        buttonText={{
          month: 'חודש',
          week: 'שבוע',
          day: 'יום',
          list: 'רשימה'
        }}
        height="auto"
        dayCellContent={({ date, dayNumberText }) => (
          <div>
            <Typography variant="body2">{dayNumberText}</Typography>
            <Typography variant="caption" color="textSecondary">
              {renderHebrewDate(date)}
            </Typography>
          </div>
        )}
      />
    </CalendarWrapper>
  );
}

export default React.memo(GregorianCalendar);