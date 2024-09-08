import { useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const MySwal = withReactContent(Swal);

export const useSweetAlert = () => {
  const showEventForm = useCallback((event = {}, onSave, onDelete) => {
    console.log('Showing event form for:', event);
    
    const startDate = event.start ? new Date(event.start) : new Date();
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);

    let formStartDate = startDate;
    let formEndDate = endDate;

    MySwal.fire({
      title: event._id ? 'ערוך אירוע' : 'הוסף אירוע חדש',
      html: (
        <div className="event-form">
          <input id="swal-input1" className="swal2-input" placeholder="כותרת" defaultValue={event.title || ''} />
          <textarea id="swal-input2" className="swal2-textarea" placeholder="תיאור" defaultValue={event.description || ''} />
          <div className="date-time-picker">
            <DatePicker
              selected={formStartDate}
              onChange={(date) => { formStartDate = date; }}
              dateFormat="dd/MM/yyyy"
              customInput={<input id="swal-input3" className="swal2-input" />}
            />
            <div className="time-picker">
              <FontAwesomeIcon icon={faClock} />
              <input 
                type="time" 
                id="swal-input4" 
                className="swal2-input" 
                defaultValue={startDate.toTimeString().slice(0,5)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  formStartDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                }}
              />
            </div>
          </div>
          <div className="date-time-picker">
            <DatePicker
              selected={formEndDate}
              onChange={(date) => { formEndDate = date; }}
              dateFormat="dd/MM/yyyy"
              customInput={<input id="swal-input5" className="swal2-input" />}
            />
            <div className="time-picker">
              <FontAwesomeIcon icon={faClock} />
              <input 
                type="time" 
                id="swal-input6" 
                className="swal2-input" 
                defaultValue={endDate.toTimeString().slice(0,5)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  formEndDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                }}
              />
            </div>
          </div>
          <select id="swal-input7" className="swal2-select" defaultValue={event.recurrence || ''}>
            <option value="">ללא חזרה</option>
            <option value="daily">יומי</option>
            <option value="weekly">שבועי</option>
            <option value="monthly">חודשי</option>
            <option value="yearly">שנתי</option>
          </select>
        </div>
      ),
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-save"></i> שמור',
      confirmButtonAriaLabel: 'שמור',
      showDenyButton: event._id ? true : false,
      denyButtonText: '<i class="fa fa-trash"></i> מחק',
      denyButtonAriaLabel: 'מחק',
      cancelButtonText: '<i class="fa fa-times"></i> בטל',
      cancelButtonAriaLabel: 'בטל',
      focusConfirm: false,
      preConfirm: () => {
        const title = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        const recurrence = document.getElementById('swal-input7').value;

        if (!title || !formStartDate || !formEndDate) {
          Swal.showValidationMessage('אנא מלא את כל השדות הנדרשים');
          return false;
        }

        if (formStartDate > formEndDate) {
          Swal.showValidationMessage('תאריך הסיום חייב להיות אחרי תאריך ההתחלה');
          return false;
        }

        return { title, description, start: formStartDate, end: formEndDate, recurrence };
      }
    }).then((result) => {
      console.log('SweetAlert result:', result);
      if (result.isConfirmed) {
        console.log('Saving event:', { ...event, ...result.value });
        onSave({ ...event, ...result.value });
      } else if (result.isDenied && event._id) {
        console.log('Deleting event:', event._id);
        onDelete(event._id);
      }
    });
  }, []);

  return { showEventForm };
};