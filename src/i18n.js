import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: {
            eventCalendar: 'Event Calendar',
          },
        },
        he: {
          translation: {
            eventCalendar: 'יומן אירועים',
          },
        },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export default initI18n;