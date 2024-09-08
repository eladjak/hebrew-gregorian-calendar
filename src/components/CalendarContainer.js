import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Fade, CircularProgress } from '@mui/material';
import GregorianCalendar from './GregorianCalendar';
import HebrewCalendar from './HebrewCalendar';
import CalendarToolbar from './CalendarToolbar';
import CustomEventModal from './CustomEventModal';
import { StyledCalendarWrapper } from './StyledComponents';
import { useEvents } from '../hooks/useEvents';

const CalendarContainer = ({ onLanguageChange }) => {
  const [isHebrew, setIsHebrew] = useState(false);
  const [view, setView] = useState('dayGridMonth');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { t } = useTranslation();
  const { events, isLoading, fetchEvents, addEvent, updateEvent, deleteEvent } = useEvents((message, type) => {
    // Implement your own notification system here
    console.log(message, type);
  }, t);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = useCallback((clickInfo) => {
    setSelectedEvent(clickInfo.event.toPlainObject());
    setModalOpen(true);
  }, []);

  const handleDateClick = useCallback((dateClickInfo) => {
    setSelectedEvent({ start: dateClickInfo.date });
    setModalOpen(true);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleCalendarTypeChange = useCallback(() => {
    setIsHebrew(prev => !prev);
  }, []);

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventData) => {
    if (eventData._id) {
      await updateEvent(eventData);
    } else {
      await addEvent(eventData);
    }
    fetchEvents();
  }, [updateEvent, addEvent, fetchEvents]);

  const handleDeleteEvent = useCallback(async (eventId) => {
    await deleteEvent(eventId);
    fetchEvents();
  }, [deleteEvent, fetchEvents]);

  const calendarProps = useMemo(() => ({
    events,
    onEventClick: handleEventClick,
    onDateClick: handleDateClick,
    view,
    onViewChange: handleViewChange,
  }), [events, handleEventClick, handleDateClick, view, handleViewChange]);

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
      <CustomEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </StyledCalendarWrapper>
  );
};

export default React.memo(CalendarContainer);