import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './App.css';
import CalendarContainer from './components/CalendarContainer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

library.add(fas);

function App() {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');

  const theme = useMemo(() => createTheme({
    direction: direction,
    palette: {
      primary: {
        main: '#3f51b5',
        light: '#757de8',
        dark: '#002984',
      },
      secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: "'Heebo', 'Roboto', Arial, sans-serif'",
      h4: {
        fontWeight: 700,
        color: '#3f51b5',
      },
      button: {
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            padding: '10px 20px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  }), [direction]);

  const handleLanguageChange = useCallback(() => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    setDirection(newLang === 'he' ? 'rtl' : 'ltr');
  }, [i18n]);

  useEffect(() => {
    setDirection(i18n.language === 'he' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700&display=swap" rel="stylesheet" />
      <div className="App" dir={direction}>
        <CalendarContainer onLanguageChange={handleLanguageChange} />
      </div>
    </ThemeProvider>
  );
}

export default App;
