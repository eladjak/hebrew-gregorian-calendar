const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Loading environment variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file exists');
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('.env file loaded successfully');
    console.log('.env content:', fs.readFileSync(envPath, 'utf-8'));
  }
} else {
  console.error('.env file does not exist at path:', envPath);
}

// Setting default values for environment variables
const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_db';

console.log('PORT:', PORT);
console.log('MONGODB_URI:', MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Connecting to the database
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Successfully connected to MongoDB');
  console.log('Connection state:', mongoose.connection.readyState);
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  console.error('Error details:', err.message);
});

// Defining the Event model
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
  recurrence: String
});

const Event = mongoose.model('Event', EventSchema);

// Endpoints
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    const expandedEvents = events.flatMap(event => {
      if (!event.recurrence) return event;

      const start = new Date(event.start);
      const end = new Date(event.end);
      const duration = end - start;
      const expandedDates = [];

      switch (event.recurrence) {
        case 'daily':
          for (let i = 0; i < 30; i++) {
            expandedDates.push({
              ...event.toObject(),
              start: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
              end: new Date(start.getTime() + i * 24 * 60 * 60 * 1000 + duration)
            });
          }
          break;
        case 'weekly':
          for (let i = 0; i < 12; i++) {
            expandedDates.push({
              ...event.toObject(),
              start: new Date(start.getTime() + i * 7 * 24 * 60 * 60 * 1000),
              end: new Date(start.getTime() + i * 7 * 24 * 60 * 60 * 1000 + duration)
            });
          }
          break;
        case 'monthly':
          for (let i = 0; i < 12; i++) {
            const newStart = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
            expandedDates.push({
              ...event.toObject(),
              start: newStart,
              end: new Date(newStart.getTime() + duration)
            });
          }
          break;
        case 'yearly':
          for (let i = 0; i < 5; i++) {
            const newStart = new Date(start.getFullYear() + i, start.getMonth(), start.getDate());
            expandedDates.push({
              ...event.toObject(),
              start: newStart,
              end: new Date(newStart.getTime() + duration)
            });
          }
          break;
        default:
          return event;
      }
      return expandedDates;
    });

    res.json(expandedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    console.log('Attempting to add new event:', req.body);
    const newEvent = await event.save();
    console.log('New event added successfully:', newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding new event:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/events/:id', async (req, res) => {
  try {
    console.log('Attempting to delete event with id:', req.params.id);
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      console.log('Event not found for deletion');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event deleted successfully:', deletedEvent);
    res.json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a new endpoint for updating events
app.put('/events/:id', async (req, res) => {
  try {
    console.log('Attempting to update event with id:', req.params.id);
    console.log('Update data:', req.body);
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      console.log('Event not found for update');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event updated successfully:', updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});