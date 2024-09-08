import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { HDate, HebrewCalendar as HebCal, months } from '@hebcal/core';

const HebrewCalendar = ({ events, onEventClick, onDateClick }) => {
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

  const handlePrevMonth = () => {
    setCurrentDate(prev => new HDate(prev).prev());
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new HDate(prev).next());
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <IconButton onClick={handlePrevMonth}><ChevronRight /></IconButton>
        <Typography variant="h5">{months[currentDate.getMonth()]}</Typography>
        <IconButton onClick={handleNextMonth}><ChevronLeft /></IconButton>
      </div>
      <Grid container spacing={1}>
        {calendarDays.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <div 
              style={{ 
                border: '1px solid #ddd', 
                padding: '0.5rem', 
                height: '100px', 
                overflow: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => onDateClick(day)}
            >
              <Typography>{day.getDate()}</Typography>
              {events
                .filter(event => new HDate(event.start).isSameDate(day))
                .map((event, eventIndex) => (
                  <div 
                    key={eventIndex} 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{ 
                      backgroundColor: '#e0e0e0', 
                      margin: '2px 0', 
                      padding: '2px',
                      borderRadius: '2px'
                    }}
                  >
                    {event.title}
                  </div>
                ))
              }
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HebrewCalendar;