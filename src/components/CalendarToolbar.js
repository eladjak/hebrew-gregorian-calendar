import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faPlus, faLanguage, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const CalendarToolbar = ({
  onLanguageChange,
  onRefresh,
  isHebrew,
  onCalendarTypeChange,
  onAddEvent,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box>
        <Tooltip title="הוסף אירוע חדש">
          <IconButton onClick={onAddEvent} color="primary">
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </Tooltip>
        <Tooltip title="רענן אירועים">
          <IconButton onClick={onRefresh} color="primary">
            <FontAwesomeIcon icon={faSync} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip title={isHebrew ? "עבור ללוח גרגוריאני" : "עבור ללוח עברי"}>
          <IconButton onClick={onCalendarTypeChange} color="primary">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </IconButton>
        </Tooltip>
        <Tooltip title="החלף שפה">
          <IconButton onClick={onLanguageChange} color="primary">
            <FontAwesomeIcon icon={faLanguage} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default React.memo(CalendarToolbar);