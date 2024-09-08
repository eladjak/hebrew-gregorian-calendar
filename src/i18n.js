import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      eventCalendar: 'EY Calendar',
      addNewEvent: 'Add New Event',
      eventTitle: 'Event Title',
      eventDescription: 'Event Description',
      startTime: 'Start Time',
      endTime: 'End Time',
      eventOptions: 'Event Options',
      delete: 'Delete',
      edit: 'Edit',
      deleted: 'Deleted',
      eventDeleted: 'Event has been deleted.',
      updated: 'Updated',
      eventUpdated: 'Event has been updated.',
      editEvent: 'Edit Event',
      hebrewInterface: 'Switch to Hebrew',
      refreshEvents: 'Refresh Events',
      failedToLoadEvents: 'Failed to load events. Please try again.',
      eventAddedSuccessfully: 'Event added successfully',
      failedToAddEvent: 'Failed to add event. Please try again.',
      failedToDeleteEvent: 'Failed to delete event. Please try again.',
      failedToUpdateEvent: 'Failed to update event. Please try again.',
      noRepeat: 'No Repeat',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      recurrence: 'Repeat',
      add: 'Add',
      cancel: 'Cancel',
      update: 'Update',
      areYouSureDelete: 'Are you sure you want to delete this event?',
      yes: 'Yes',
      no: 'No',
      notSpecified: 'Not specified',
      noTitle: 'No title',
      noDescription: 'No description',
      switchToHebrew: 'Switch to Hebrew',
      switchToEnglish: 'Switch to English'
    }
  },
  he: {
    translation: {
      eventCalendar: 'יומן EY',
      addNewEvent: 'הוסף אירוע חדש',
      eventTitle: 'כותרת האירוע',
      eventDescription: 'תיאור האירוע',
      startTime: 'זמן התחלה',
      endTime: 'זמן סיום',
      eventOptions: 'אפשרויות אירוע',
      delete: 'מחק',
      edit: 'ערוך',
      deleted: 'נמחק',
      eventDeleted: 'האירוע נמחק.',
      updated: 'עודכן',
      eventUpdated: 'האירוע עודכן.',
      editEvent: 'ערוך אירוע',
      hebrewInterface: 'עבור לעברית',
      refreshEvents: 'רענן אירועים',
      failedToLoadEvents: 'טעינת האירועים נכשלה. אנא נסה שנית.',
      eventAddedSuccessfully: 'האירוע נוסף בהצלחה',
      failedToAddEvent: 'הוספת האירוע נכשלה. אנא נסה שנית.',
      failedToDeleteEvent: 'מחיקת האירוע נכשלה. אנא נסה שנית.',
      failedToUpdateEvent: 'עדכון האירוע נכשל. אנא נסה שנית.',
      noRepeat: 'ללא חזרה',
      daily: 'יומי',
      weekly: 'שבועי',
      monthly: 'חודשי',
      yearly: 'שנתי',
      recurrence: 'חזרה',
      add: 'הוסף',
      cancel: 'בטל',
      update: 'עדכן',
      areYouSureDelete: 'האם אתה בטוח שברצונך למחוק אירוע זה?',
      yes: 'כן',
      no: 'לא',
      notSpecified: 'לא צוין',
      noTitle: 'ללא כותרת',
      noDescription: 'ללא תיאור',
      switchToHebrew: 'עבור לעברית',
      switchToEnglish: 'עבור לאנגלית'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;