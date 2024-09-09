import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Fade, CircularProgress } from '@mui/material';
import GregorianCalendar from './GregorianCalendar';
import HebrewCalendar from './HebrewCalendar';
import CalendarToolbar from './CalendarToolbar';
import CustomEventModal from './CustomEventModal';
import { StyledCalendarWrapper } from './StyledComponents';
import { useEvents } from '../hooks/useEvents';
import PropTypes from 'prop-types';

const CalendarContainer = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isHebrew, setIsHebrew] = useState(i18n.language === 'he');
  const [view, setView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { events, isLoading, fetchEvents, addEvent, updateEvent, deleteEvent } = useEvents(
    (message, type) => {
      // הודעת התראה כאן
      console.log(message, type);
    },
    t
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleLanguageChange = useCallback(() => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    setIsHebrew(newLang === 'he');
    onLanguageChange();
  }, [i18n, onLanguageChange]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleEventClick = useCallback((eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setIsModalOpen(true);
  }, []);

  const handleDateClick = useCallback((arg) => {
    const newEvent = {
      start: arg.date,
      end: new Date(arg.date.getTime() + 60 * 60 * 1000), // שעה אחת אחרי ההתחלה
      allDay: arg.allDay
    };
    setSelectedEvent(newEvent);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleSaveEvent = useCallback((eventData) => {
    if (eventData._id) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    handleCloseModal();
  }, [updateEvent, addEvent]);

  const handleDeleteEvent = useCallback((eventId) => {
    deleteEvent(eventId);
    handleCloseModal();
  }, [deleteEvent]);

  const calendarComponent = useMemo(() => {
    return isHebrew ? (
      <HebrewCalendar
        events={events}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        view={view}
        onViewChange={handleViewChange}
      />
    ) : (
      <GregorianCalendar
        events={events}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        view={view}
        onViewChange={handleViewChange}
      />
    );
  }, [isHebrew, events, handleEventClick, handleDateClick, view, handleViewChange]);

  return (
    <StyledCalendarWrapper>
      <CalendarToolbar
        isHebrew={isHebrew}
        onLanguageChange={handleLanguageChange}
        onAddEvent={() => setIsModalOpen(true)}
      />
      <Box position="relative">
        <Fade in={!isLoading}>
          {calendarComponent}
        </Fade>
        {isLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
      <CustomEventModal
        open={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </StyledCalendarWrapper>
  );
};

CalendarContainer.propTypes = {
  onLanguageChange: PropTypes.func.isRequired
};

export default React.memo(CalendarContainer);