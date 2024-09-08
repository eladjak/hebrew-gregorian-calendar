import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CustomEventModal = ({ open, onClose, event, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStart(event.start ? new Date(event.start).toISOString().slice(0, 16) : '');
      setEnd(event.end ? new Date(event.end).toISOString().slice(0, 16) : '');
    }
  }, [event]);

  const handleSave = () => {
    onSave({ ...event, title, description, start, end });
    onClose();
  };

  const handleDelete = () => {
    onDelete(event._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{event && event._id ? 'ערוך אירוע' : 'הוסף אירוע חדש'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="כותרת"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="תיאור"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="התחלה"
          type="datetime-local"
          fullWidth
          value={start}
          onChange={(e) => setStart(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="סיום"
          type="datetime-local"
          fullWidth
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          ביטול
        </Button>
        {event && event._id && (
          <Button onClick={handleDelete} color="secondary">
            מחק
          </Button>
        )}
        <Button onClick={handleSave} color="primary">
          {event && event._id ? 'עדכן' : 'הוסף'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomEventModal;