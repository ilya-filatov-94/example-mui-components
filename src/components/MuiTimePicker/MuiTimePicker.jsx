import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export default function TimeFilter({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  const safeValue = value ?? '';

  const handleTimeChange = e => {
    onChange(e.target.value);
    e.target.blur();
  };

  const handleClear = e => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
  };

  return (
    <TextField
      label="Время"
      type="time"
      value={safeValue}
      onChange={handleTimeChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      size="small"
      sx={{
        minWidth: '225px',
        ...(safeValue === '' && {
          '& input[type="time"]:not(:focus)::-webkit-datetime-edit-hour-field, & input[type="time"]:not(:focus)::-webkit-datetime-edit-minute-field, & input[type="time"]:not(:focus)::-webkit-datetime-edit-text':
            {
              color: 'transparent',
            },
          '& input[type="time"]:not(:focus)::-webkit-datetime-edit-ampm-field':
            {
              color: 'transparent',
            },
        }),
      }}
      InputLabelProps={{
        shrink: isFocused || safeValue !== '',
      }}
      InputProps={{
        endAdornment: safeValue ? (
          <IconButton
            size="small"
            onClick={handleClear}
            edge="end"
            aria-label="Очистить время"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ) : null,
      }}
    />
  );
}
