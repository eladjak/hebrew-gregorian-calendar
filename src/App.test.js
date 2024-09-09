import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // ייתכן שתצטרך ליצור קובץ כזה אם הוא לא קיים

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { changeLanguage: jest.fn() } }),
  I18nextProvider: ({ children }) => children,
}));

test('renders calendar component', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  const calendarElement = screen.getByText(/eventCalendar/i);
  expect(calendarElement).toBeInTheDocument();
});
