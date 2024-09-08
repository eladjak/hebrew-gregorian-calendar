import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import heLocale from '@fullcalendar/core/locales/he';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { 
  Container, 
  Paper, 
  Typography, 
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faSync, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HDate } from '@hebcal/core';
import CustomCalendar from './CustomCalendar';
import PropTypes from 'prop-types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
}));

const StyledCalendar = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .fc': {
    fontFamily: "'Heebo', 'Roboto', sans-serif",
  },
  '& .fc-toolbar-title': {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  '& .fc-button': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.05)',
    },
    borderRadius: '25px',
    padding: '10px 20px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease-in-out',
  },
  '& .fc-event': {
    backgroundColor: theme.palette.secondary.light,
    borderColor: theme.palette.secondary.main,
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
  },
  '& .fc-day': {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .fc-daygrid-day-number': {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  '& .hebrew-date': {
    fontFamily: "'Heebo', 'Roboto', sans-serif",
    direction: 'rtl',
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },
}));

const Controls = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const AnimatedIconButton = styled(IconButton)(() => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const customSwalStyle = Swal.mixin({
  customClass: {
    container: 'my-swal-container',
    popup: 'my-swal-popup',
    header: 'my-swal-header',
    title: 'my-swal-title',
    closeButton: 'my-swal-close-button',
    icon: 'my-swal-icon',
    image: 'my-swal-image',
    content: 'my-swal-content',
    input: 'my-swal-input',
    actions: 'my-swal-actions',
    confirmButton: 'my-swal-confirm-button',
    cancelButton: 'my-swal-cancel-button',
    footer: 'my-swal-footer'
  },
  buttonsStyling: false
});

function toHebrewNumeral(num) {
  const hebChars = 'אבגדהוזחטיכלמנסעפצקרשת';
  const hebNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400];
  
  if (num < 1 || num > 999) return num.toString();
  
  let result = '';
  for (let i = hebNums.length - 1; i >= 0; i--) {
    while (num >= hebNums[i]) {
      result += hebChars[i];
      num -= hebNums[i];
    }
  }
  
  return result;
}

const Calendar = ({ onLanguageChange }) => {
  const [events, setEvents] = useState([]);
  const [isHebrew, setIsHebrew] = useState(false);
  const { t, i18n } = useTranslation();
  const calendarRef = useRef(null);
  const [useCustomCalendar, setUseCustomCalendar] = useState(false);
  const workerRef = useRef();

  const showFeedback = useCallback((message, type = 'success') => {
    customSwalStyle.fire({
      icon: type,
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      console.warn('Fetching events from:', API_URL);
      const response = await axios.get(`${API_URL}/events`);
      console.warn('Fetched events:', response.data);
      workerRef.current.postMessage({ type: 'PROCESS_EVENTS', events: response.data });
    } catch (error) {
      console.error('Error loading events:', error);
      showFeedback(t('failedToLoadEvents'), 'error');
    }
  }, [t, showFeedback]);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/calendarWorker.js', import.meta.url));
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'EVENTS_PROCESSED') {
        setEvents(e.data.events);
      }
    };

    return () => workerRef.current.terminate();
  }, []);

  useEffect(() => {
    fetchEvents();
    const currentCalendar = calendarRef.current;
    return () => {
      if (currentCalendar) {
        const calendarApi = currentCalendar.getApi();
        calendarApi.destroy();
      }
    };
  }, [fetchEvents]);

  useEffect(() => {
    const currentCalendar = calendarRef.current;
    if (currentCalendar) {
      const calendarApi = currentCalendar.getApi();
      calendarApi.setOption('locale', isHebrew ? 'he' : 'en');
    }
  }, [isHebrew]);

  const handleDateClick = (arg) => {
    let startDate = arg.date;
    let endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    customSwalStyle.fire({
      title: t('addNewEvent'),
      html:
        `<div class="swal-form-container">
          <div class="swal-form-group">
            <label for="swal-input1">${t('eventTitle')}</label>
            <input id="swal-input1" class="swal2-input" placeholder="${t('eventTitle')}">
          </div>
          <div class="swal-form-group">
            <label for="swal-input2">${t('eventDescription')}</label>
            <textarea id="swal-input2" class="swal2-textarea" placeholder="${t('eventDescription')}"></textarea>
          </div>
          <div class="swal-form-group">
            <label for="start-date-picker">${t('startTime')}</label>
            <input id="start-date-picker" class="swal2-input" type="datetime-local">
          </div>
          <div class="swal-form-group">
            <label for="end-date-picker">${t('endTime')}</label>
            <input id="end-date-picker" class="swal2-input" type="datetime-local">
          </div>
          <div class="swal-form-group">
            <label for="swal-input5">${t('recurrence')}</label>
            <select id="swal-input5" class="swal2-select">
              <option value="">${t('noRepeat')}</option>
              <option value="daily">${t('daily')}</option>
              <option value="weekly">${t('weekly')}</option>
              <option value="monthly">${t('monthly')}</option>
              <option value="yearly">${t('yearly')}</option>
            </select>
          </div>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: `<i class="fas fa-plus"></i>`,
      cancelButtonText: `<i class="fas fa-times"></i>`,
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        cancelButton: 'my-swal-cancel-button'
      },
      didOpen: () => {
        document.getElementById('start-date-picker').value = startDate.toISOString().slice(0, 16);
        document.getElementById('end-date-picker').value = endDate.toISOString().slice(0, 16);
      },
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('start-date-picker').value,
          document.getElementById('end-date-picker').value,
          document.getElementById('swal-input5').value
        ]
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const [title, description, start, end, recurrence] = result.value;
        if (title && start && end) {
          const newEvent = { title, description, start, end, recurrence };
          addEvent(newEvent);
        }
      }
    });
  };

  const addEvent = async (newEvent) => {
    try {
      console.warn('Adding new event:', newEvent);
      await axios.post(`${API_URL}/events`, newEvent);
      fetchEvents();
      showFeedback(t('eventAddedSuccessfully'));
    } catch (error) {
      console.error('Error adding event:', error);
      showFeedback(t('failedToAddEvent'), 'error');
    }
  };

  const updateEvent = async (event) => {
    try {
      console.warn('Updating event:', event);
      const response = await axios.put(`${API_URL}/events/${event._id}`, event);
      console.warn('Update response:', response.data);
      setEvents(prevEvents => prevEvents.map(e => e._id === event._id ? response.data : e));
      showFeedback(t('eventUpdated'), 'success');
    } catch (error) {
      console.error('Error updating event:', error);
      showFeedback(t('failedToUpdateEvent'), 'error');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      console.warn('Deleting event with id:', eventId);
      await axios.delete(`${API_URL}/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      showFeedback(t('eventDeleted'), 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showFeedback(t('failedToDeleteEvent'), 'error');
    }
  };

  const handleEventClick = (clickInfo) => {
    console.warn('Event clicked:', clickInfo.event);
    Swal.fire({
      title: t('eventOptions'),
      icon: 'question',
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonText: `<i class="fas fa-trash"></i>`,
      cancelButtonText: `<i class="fas fa-edit"></i>`,
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        cancelButton: 'my-swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvent(clickInfo.event.extendedProps._id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        showEventForm(clickInfo.event);
      }
    });
  };

  const showEventForm = (event = null) => {
    const isEdit = !!event;
    Swal.fire({
      title: isEdit ? t('editEvent') : t('addNewEvent'),
      html: `
        <div class="swal-form-container">
          <div class="swal-form-group">
            <label for="title">${t('eventTitle')}</label>
            <input id="title" class="swal2-input" value="${event ? event.title : ''}" placeholder="${t('eventTitle')}">
          </div>
          <div class="swal-form-group">
            <label for="description">${t('eventDescription')}</label>
            <textarea id="description" class="swal2-textarea" placeholder="${t('eventDescription')}">${event && event.extendedProps ? event.extendedProps.description : ''}</textarea>
          </div>
          <div class="swal-form-group">
            <label for="start">${t('startTime')}</label>
            <input id="start" class="swal2-input" type="datetime-local" value="${event && event.start ? event.start.toISOString().slice(0, 16) : ''}">
          </div>
          <div class="swal-form-group">
            <label for="end">${t('endTime')}</label>
            <input id="end" class="swal2-input" type="datetime-local" value="${event && event.end ? event.end.toISOString().slice(0, 16) : ''}">
          </div>
          <div class="swal-form-group">
            <label for="recurrence">${t('recurrence')}</label>
            <select id="recurrence" class="swal2-select">
              <option value="none">${t('noRepeat')}</option>
              <option value="daily">${t('daily')}</option>
              <option value="weekly">${t('weekly')}</option>
              <option value="monthly">${t('monthly')}</option>
              <option value="yearly">${t('yearly')}</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonText: `<i class="fas fa-${isEdit ? 'check' : 'plus'}"></i>`,
      cancelButtonText: `<i class="fas fa-times"></i>`,
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        cancelButton: 'my-swal-cancel-button'
      },
      preConfirm: () => {
        const title = Swal.getPopup().querySelector('#title').value;
        const description = Swal.getPopup().querySelector('#description').value;
        const start = Swal.getPopup().querySelector('#start').value;
        const end = Swal.getPopup().querySelector('#end').value;
        const recurrence = Swal.getPopup().querySelector('#recurrence').value;
        if (!title || !start || !end) {
          Swal.showValidationMessage(t('pleaseEnterAllFields'));
          return false;
        }
        return { title, description, start, end, recurrence };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newEvent = {
          title: result.value.title,
          description: result.value.description,
          start: result.value.start,
          end: result.value.end,
          recurrence: result.value.recurrence
        };
        if (isEdit) {
          newEvent._id = event.extendedProps._id;
          updateEvent(newEvent);
        } else {
          addEvent(newEvent);
        }
      }
    });
  };

  const handleLanguageChange = useCallback(() => {
    const newLang = isHebrew ? 'en' : 'he';
    setIsHebrew(!isHebrew);
    i18n.changeLanguage(newLang);
    onLanguageChange(newLang);
    
    requestAnimationFrame(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.setOption('locale', newLang === 'he' ? heLocale : 'en');
        calendarApi.refetchEvents();
      }
    });
  }, [isHebrew, i18n, onLanguageChange]);

  const dateRender = (arg) => {
    const date = arg.date;
    const hDate = new HDate(date);
    const hebrewDate = hDate.getDate();
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div>{date.getDate()}</div>
        <div className="hebrew-date">{hebrewDate > 0 ? toHebrewNumeral(hebrewDate) : ''}</div>
      </div>
    );
  };

  const renderHebrewMonthYear = (date) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid date passed to renderHebrewMonthYear:', date);
        return '';
      }
      const hDate = new HDate(date);
      const hebrewMonth = hDate.getMonthName('h');
      const hebrewYear = hDate.getFullYear();
      
      const hebrewMonthNames = ['ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול', 'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר'];
      
      const hebrewYearString = toHebrewNumeral(hebrewYear);
      
      const hebrewMonthName = hebrewMonthNames[hDate.getMonth()];
      
      return isHebrew ? `${hebrewMonthName} ${hebrewYearString}` : `${hebrewMonth} ${hebrewYear}`;
    } catch (error) {
      console.error('Error rendering Hebrew date:', error);
      return '';
    }
  };

  const handleEventChange = (info) => {
    const updatedEvent = {
      _id: info.event.extendedProps._id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description: info.event.extendedProps.description,
      recurrence: info.event.extendedProps.recurrence
    };
    updateEvent(updatedEvent);
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          {t('eventCalendar')}
        </Typography>
        <Controls>
          <Tooltip title={t('addNewEvent')} arrow>
            <AnimatedIconButton onClick={() => showEventForm()} color="primary">
              <FontAwesomeIcon icon={faPlus} />
            </AnimatedIconButton>
          </Tooltip>
          <Tooltip title={isHebrew ? t('switchToEnglish') : t('switchToHebrew')} arrow>
            <AnimatedIconButton onClick={handleLanguageChange} color="primary">
              <FontAwesomeIcon icon={faLanguage} />
            </AnimatedIconButton>
          </Tooltip>
          <Tooltip title={t('refreshEvents')} arrow>
            <AnimatedIconButton onClick={fetchEvents} color="primary">
              <FontAwesomeIcon icon={faSync} />
            </AnimatedIconButton>
          </Tooltip>
        </Controls>
        <Button onClick={() => setUseCustomCalendar(!useCustomCalendar)}>
          {useCustomCalendar ? 'Use FullCalendar' : 'Use Custom Calendar'}
        </Button>
        {useCustomCalendar ? (
          <CustomCalendar 
            events={events} 
            onEventClick={handleEventClick} 
            onDateClick={handleDateClick}
          />
        ) : (
          <StyledCalendar>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              locale={isHebrew ? heLocale : 'en'}
              dayCellContent={dateRender}
              titleFormat={(arg) => {
                if (!arg || !arg.date || !arg.date.marker) {
                  console.error('Invalid date object:', arg);
                  return '';
                }
                const date = new Date(arg.date.marker);
                if (isNaN(date.getTime())) {
                  console.error('Invalid date:', date);
                  return '';
                }
                const gregorianTitle = new Intl.DateTimeFormat(isHebrew ? 'he-IL' : 'en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                }).format(date);
                const hebrewTitle = renderHebrewMonthYear(date);
                return isHebrew ? hebrewTitle : `${gregorianTitle} - ${hebrewTitle}`;
              }}
              editable={true}
              eventResizableFromStart={true}
              eventDurationEditable={true}
              eventDrop={(info) => handleEventChange(info)}
              eventResize={(info) => handleEventChange(info)}
            />
          </StyledCalendar>
        )}
      </StyledPaper>
    </Container>
  );
};

Calendar.propTypes = {
  onLanguageChange: PropTypes.func.isRequired,
};

export default Calendar;