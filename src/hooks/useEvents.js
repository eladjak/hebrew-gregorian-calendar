import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

export const useEvents = (showMessage, t) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    console.warn('Fetching events...');
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events`);
      console.warn('Fetched events:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage(t('errorFetchingEvents'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showMessage, t]);

  const addEvent = useCallback(async (newEvent) => {
    console.warn('Adding event:', newEvent);
    try {
      const response = await axios.post(`${API_URL}/events`, newEvent);
      console.warn('Event added:', response.data);
      setEvents(prevEvents => [...prevEvents, response.data]);
      showMessage(t('eventAdded'), 'success');
    } catch (error) {
      console.error('Error adding event:', error);
      showMessage(t('failedToAddEvent'), 'error');
    }
  }, [showMessage, t]);

  const updateEvent = useCallback(async (updatedEvent) => {
    try {
      const response = await axios.put(`${API_URL}/events/${updatedEvent._id}`, updatedEvent);
      setEvents(prevEvents => prevEvents.map(event => event._id === updatedEvent._id ? response.data : event));
      showMessage(t('eventUpdated'), 'success');
    } catch (error) {
      console.error('Error updating event:', error);
      showMessage(t('failedToUpdateEvent'), 'error');
    }
  }, [showMessage, t]);

  const deleteEvent = useCallback(async (eventId) => {
    if (!eventId) {
      console.error('Attempt to delete event without ID');
      showMessage(t('failedToDeleteEvent'), 'error');
      return;
    }
    try {
      await axios.delete(`${API_URL}/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      showMessage(t('eventDeleted'), 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showMessage(t('failedToDeleteEvent'), 'error');
    }
  }, [showMessage, t]);

  return { events, isLoading, fetchEvents, addEvent, updateEvent, deleteEvent };
};