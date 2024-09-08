import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

export const useEvents = (showAlert, t) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchEventsRef = useRef(null);

  fetchEventsRef.current = async () => {
    console.log('Fetching events...');
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events`);
      console.log('Fetched events:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showAlert(t('errorFetchingEvents'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchEvents = useCallback(() => {
    const fetchEvents = () => {
      if (fetchEventsRef.current) {
        fetchEventsRef.current();
      }
    };
    return debounce(fetchEvents, 300);
  }, []);

  useEffect(() => {
    const fetchEventsDebounced = debouncedFetchEvents();
    fetchEventsDebounced();
    return () => fetchEventsDebounced.cancel();
  }, [debouncedFetchEvents]);

  const addEvent = useCallback(async (newEvent) => {
    console.log('Adding event:', newEvent);
    try {
      const response = await axios.post(`${API_URL}/events`, newEvent);
      console.log('Event added:', response.data);
      setEvents(prevEvents => [...prevEvents, response.data]);
      showAlert('success', t('success'), t('eventAdded'));
    } catch (error) {
      console.error('Error adding event:', error);
      showAlert('error', t('error'), t('failedToAddEvent'));
    }
  }, [showAlert, t]);

  const updateEvent = useCallback(async (updatedEvent) => {
    console.log('Updating event:', updatedEvent);
    try {
      const response = await axios.put(`${API_URL}/events/${updatedEvent._id}`, updatedEvent);
      console.log('Event updated:', response.data);
      setEvents(prevEvents => prevEvents.map(event => event._id === updatedEvent._id ? response.data : event));
      showAlert('success', t('success'), t('eventUpdated'));
    } catch (error) {
      console.error('Error updating event:', error);
      showAlert('error', t('error'), t('failedToUpdateEvent'));
    }
  }, [showAlert, t]);

  const deleteEvent = useCallback(async (eventId) => {
    console.log('Deleting event:', eventId);
    if (!eventId) {
      console.error('Attempt to delete event without ID');
      showAlert(t('error'), t('failedToDeleteEvent'));
      return;
    }
    try {
      await axios.delete(`${API_URL}/events/${eventId}`);
      console.log('Event deleted:', eventId);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      showAlert(t('success'), t('eventDeleted'));
    } catch (error) {
      console.error('Error deleting event:', error);
      showAlert(t('error'), t('failedToDeleteEvent'));
    }
  }, [showAlert, t]);

  return { events, isLoading, fetchEvents: debouncedFetchEvents(), addEvent, updateEvent, deleteEvent };
};