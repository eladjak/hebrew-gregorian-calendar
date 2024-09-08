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

const HebrewCalendarComponent = ({ events, onEventClick, onDateClick, view }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log('View changed in Hebrew Calendar:', view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(() => {
        calendarApi.changeView(view);
      }, 0);
    }
  }, [view]);

  const renderGregorianDate = useCallback((date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    return date.toLocaleDateString('he-IL');
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
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        buttonText={{
          today: 'היום',
          month: 'חודש',
          week: 'שבוע',
          day: 'יום',
          list: 'רשימה'
        }}
        height="auto"
        dayCellContent={({ date, dayNumberText }) => {
          const hDate = new HDate(date);
          return (
            <div>
              <Typography variant="body2">{gematriya(hDate.getDate())}</Typography>
              <Typography variant="caption" color="textSecondary">
                {renderGregorianDate(date)}
              </Typography>
            </div>
          );
        }}
      />
    </CalendarWrapper>
  );
}

export default React.memo(HebrewCalendarComponent);