import { useCallback } from 'react';
import Swal from 'sweetalert2';

export const useSweetAlert = () => {
  const showEventForm = useCallback((event = {}, onSave, onDelete) => {
    Swal.fire({
      title: event._id ? 'ערוך אירוע' : 'הוסף אירוע חדש',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="כותרת" value="${event.title || ''}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="תיאור">${event.description || ''}</textarea>
        <input id="swal-input3" class="swal2-input" type="datetime-local" value="${event.start ? new Date(event.start).toISOString().slice(0, 16) : ''}">
        <input id="swal-input4" class="swal2-input" type="datetime-local" value="${event.end ? new Date(event.end).toISOString().slice(0, 16) : ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: event._id ? 'עדכן' : 'הוסף',
      cancelButtonText: 'ביטול',
      showDenyButton: event._id ? true : false,
      denyButtonText: 'מחק',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-input1').value,
          description: document.getElementById('swal-input2').value,
          start: document.getElementById('swal-input3').value,
          end: document.getElementById('swal-input4').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onSave({ ...event, ...result.value });
      } else if (result.isDenied && event._id) {
        onDelete(event._id);
      }
    });
  }, []);

  return { showEventForm };
};