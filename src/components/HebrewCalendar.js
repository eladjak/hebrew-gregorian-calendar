import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Grid, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { HDate, HebrewCalendar as HebCal, months } from '@hebcal/core';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const CalendarWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #f3f4f6, #ffffff)',
}));

const DayCell = styled('div')(({ theme }) => ({
  border: '1px solid #ddd',
  padding: '0.5rem',
  height: '100px',
  overflow: 'auto',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EventChip = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  margin: '2px 0',
  padding: '2px 4px',
  borderRadius: '2px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const HebrewCalendar = ({ events, onEventClick, onDateClick, view, onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(new HDate());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const days = HebCal.calendar({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      isHebrewYear: true,
    });
    setCalendarDays(days);
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new HDate(prev).prev());
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new HDate(prev).next());
  }, []);

  const renderDayCell = useCallback((day) => (
    <Grid item xs={12 / 7} key={day.getDate()}>
      <DayCell onClick={() => onDateClick(day)}>
        <Typography>{day.getDate()}</Typography>
        {events
          .filter(event => new HDate(event.start).isSameDate(day))
          .map((event, eventIndex) => (
            <EventChip
              key={eventIndex}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
            >
              {event.title}
            </EventChip>
          ))
        }
      </DayCell>
    </Grid>
  ), [events, onEventClick, onDateClick]);

  return (
    <CalendarWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <IconButton onClick={handlePrevMonth}><ChevronRight /></IconButton>
        <Typography variant="h5">{months[currentDate.getMonth()]}</Typography>
        <IconButton onClick={handleNextMonth}><ChevronLeft /></IconButton>
      </div>
      <Grid container spacing={1}>
        {calendarDays.map(renderDayCell)}
      </Grid>
    </CalendarWrapper>
  );
};

HebrewCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  onEventClick: PropTypes.func.isRequired,
  onDateClick: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired
};

export default React.memo(HebrewCalendar);