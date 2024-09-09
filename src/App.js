import React, { useEffect } from 'react';
import Calendar from './components/Calendar';
import initI18n from './i18n';

const App = () => {
  useEffect(() => {
    initI18n();
  }, []);

  return <Calendar onLanguageChange={() => {}} />;
};

export default App;
