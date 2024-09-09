import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

// Mock the i18next library
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key === 'eventCalendar' ? 'Event Calendar' : key,
    i18n: { changeLanguage: jest.fn() }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
}));

// Mock the i18n initialization
jest.mock('./i18n', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock MUI's useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

// Mock the Fade component from MUI
jest.mock('@mui/material/Fade', () => ({ children }) => children);

// Mock FullCalendar
jest.mock('@fullcalendar/react', () => () => <div data-testid="fullcalendar">FullCalendar Mock</div>);

// Mock the calendar worker
jest.mock('worker-loader!../workers/calendarWorker', () => {
  return class {
    constructor() {
      this.onmessage = jest.fn();
    }
    postMessage = jest.fn();
  };
}, { virtual: true });

test('renders calendar component', async () => {
  await act(async () => {
    render(<App />);
  });
  
  await waitFor(() => {
    const calendarElement = screen.getByTestId("fullcalendar");
    expect(calendarElement).toBeInTheDocument();
  }, { timeout: 10000 });
});

test('switches language', async () => {
  await act(async () => {
    render(<App />);
  });
  
  // Test for English
  await waitFor(() => {
    expect(screen.getByText('Event Calendar')).toBeInTheDocument();
  });

  // TODO: Implement language switch and test for Hebrew
});

test('adds new event', async () => {
  // TODO: Implement test for adding a new event
});

test('edits existing event', async () => {
  // TODO: Implement test for editing an existing event
});

test('deletes event', async () => {
  // TODO: Implement test for deleting an event
});
