import { styled } from '@mui/system';
import { Paper, Box, IconButton, ToggleButtonGroup, Button } from '@mui/material';

export const StyledCalendarWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #f3f4f6, #ffffff)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const CalendarWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #f3f4f6, #ffffff)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const DayCell = styled(Paper)(({ theme, isToday }) => ({
  padding: theme.spacing(1),
  height: '100%',
  minHeight: '80px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isToday ? theme.palette.primary.light : theme.palette.background.paper,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '60px',
  },
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1) rotate(15deg)',
  },
}));

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    color: theme.palette.primary.main,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

export const AnimatedButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0.5, 0),
  },
}));