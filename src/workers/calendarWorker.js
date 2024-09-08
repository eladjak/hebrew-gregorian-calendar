/* eslint-disable no-restricted-globals */
self.addEventListener('message', (e) => {
  if (e.data.type === 'PROCESS_EVENTS') {
    // עיבוד האירועים
    const processedEvents = e.data.events.map(event => {
      // כאן נוכל להוסיף לוגיקה לעיבוד האירועים
      // לדוגמה, נוכל להוסיף שדות נוספים או לשנות את המבנה שלהם
      return {
        ...event,
        processed: true
      };
    });
    self.postMessage({ type: 'EVENTS_PROCESSED', events: processedEvents });
  }
});