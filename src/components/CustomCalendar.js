import React, { useState } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { HDate } from '@hebcal/core';

function CustomCalendar({ events, onEventClick, onDateClick }) {
  const [currentDate] = useState(new Date());

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];

    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      const hebrewDate = new HDate(day);
      const dayEvents = events.filter(event => 
        new Date(event.start).toDateString() === day.toDateString()
      );

      days.push(
        <Grid item key={day.toISOString()}>
          <Paper elevation={3} style={{ padding: '10px', cursor: 'pointer' }} onClick={() => onDateClick(day)}>
            <Typography>{day.getDate()}</Typography>
            <Typography>{hebrewDate.toString('h')}</Typography>
            {dayEvents.map(event => (
              <Button key={event._id} onClick={() => onEventClick(event)}>
                {event.title}
              </Button>
            ))}
          </Paper>
        </Grid>
      );
    }

    return (
      <Grid container spacing={1}>
        {days}
      </Grid>
    );
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4">
        {currentDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
      </Typography>
      {renderCalendar()}
    </Paper>
  );
}

export default CustomCalendar;