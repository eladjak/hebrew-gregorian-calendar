import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
jest.mock('axios');

// Mock the i18n initialization
jest.mock('./i18n', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock MUI's useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

// Mock the scrollTo function
window.scrollTo = jest.fn();

// Mock the ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the Fade component from MUI
jest.mock('@mui/material/Fade', () => ({ children }) => children);

// Wrap the test in act
import { act } from 'react-dom/test-utils';

test('renders calendar component', async () => {
  render(<App />);
  
  await waitFor(() => {
    const calendarElement = screen.getByText(/יומן אירועים|Event Calendar/i);
    expect(calendarElement).toBeInTheDocument();
  }, { timeout: 5000 });
});

test('switches language', async () => {
  render(<App />);
  
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
