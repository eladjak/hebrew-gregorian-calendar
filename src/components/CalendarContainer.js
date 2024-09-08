import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Fade, CircularProgress, Button } from '@mui/material';
import Swal from 'sweetalert2';
import GregorianCalendar from './GregorianCalendar';
import HebrewCalendar from './HebrewCalendar';
import CalendarToolbar from './CalendarToolbar';
import { StyledCalendarWrapper } from './StyledComponents';
import { useSweetAlert } from '../hooks/useSweetAlert';
import { useEvents } from '../hooks/useEvents';

const CalendarContainer = ({ onLanguageChange }) => {
  const [isHebrew, setIsHebrew] = useState(false);
  const [view, setView] = useState('dayGridMonth');
  const { t } = useTranslation();
  const { showEventForm } = useSweetAlert();
  const { events, isLoading, fetchEvents, addEvent, updateEvent, deleteEvent } = useEvents((message, type) => {
    Swal.fire({
      title: type === 'error' ? t('error') : t('success'),
      text: message,
      icon: type,
    });
  }, t);

  const handleEventClick = useCallback((clickInfo) => {
    showEventForm(clickInfo.event.toPlainObject(), (updatedEvent) => {
      if (updatedEvent._id) {
        updateEvent(updatedEvent);
      } else {
        deleteEvent(clickInfo.event.id);
      }
    }, () => deleteEvent(clickInfo.event.id));
  }, [showEventForm, updateEvent, deleteEvent]);

  const handleDateClick = useCallback((dateClickInfo) => {
    showEventForm({ start: dateClickInfo.date }, (newEvent) => {
      addEvent(newEvent);
    });
  }, [showEventForm, addEvent]);

  const handleViewChange = useCallback((newView) => {
    console.log('View changed to:', newView);
    setView(newView);
  }, []);

  const handleAddEvent = useCallback(() => {
    showEventForm({}, (newEvent) => {
      addEvent(newEvent);
    });
  }, [showEventForm, addEvent]);

  const handleCalendarTypeChange = useCallback(() => {
    setIsHebrew(prev => !prev);
  }, []);

  const calendarProps = useMemo(() => ({
    events,
    onEventClick: handleEventClick,
    onDateClick: handleDateClick,
    view,
  }), [events, handleEventClick, handleDateClick, view]);

  return (
    <StyledCalendarWrapper>
      <CalendarToolbar
        onLanguageChange={onLanguageChange}
        onRefresh={fetchEvents}
        isHebrew={isHebrew}
        onCalendarTypeChange={handleCalendarTypeChange}
        onAddEvent={handleAddEvent}
        view={view}
        onViewChange={handleViewChange}
      />
      <Button onClick={handleCalendarTypeChange}>
        {isHebrew ? 'Switch to Gregorian' : 'עבור ללוח עברי'}
      </Button>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Fade in={!isLoading} timeout={300}>
          <Box>
            {isHebrew ? (
              <HebrewCalendar {...calendarProps} />
            ) : (
              <GregorianCalendar {...calendarProps} />
            )}
          </Box>
        </Fade>
      )}
    </StyledCalendarWrapper>
  );
};

export default React.memo(CalendarContainer);