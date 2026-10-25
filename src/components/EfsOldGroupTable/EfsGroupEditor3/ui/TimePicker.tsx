import { useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export interface TimePickerProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  label?: string;
  autoBlur?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  onEnter?: () => void;
  disabled?: boolean;
  minWidth?: number;
  hideClear?: boolean;
}

export function TimePicker({
  value,
  onChange,
  label,
  autoBlur = true,
  autoFocus,
  onBlur,
  onEnter,
  disabled,
  minWidth = 225,
  hideClear,
}: TimePickerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const safeValue = value ?? '';

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      if (autoBlur) e.target.blur();
    },
    [onChange, autoBlur],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange('');
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      type="time"
      value={safeValue}
      onChange={handleTimeChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        onBlur?.();
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') onEnter?.();
      }}
      size="small"
      autoFocus={autoFocus}
      disabled={disabled}
      sx={{
        minWidth,
        ...(safeValue === '' && {
          '& input[type="time"]:not(:focus)::-webkit-datetime-edit-hour-field, & input[type="time"]:not(:focus)::-webkit-datetime-edit-minute-field, & input[type="time"]:not(:focus)::-webkit-datetime-edit-text':
            { color: 'transparent' },
          '& input[type="time"]:not(:focus)::-webkit-datetime-edit-ampm-field':
            { color: 'transparent' },
        }),
      }}
      InputLabelProps={
        label ? { shrink: isFocused || safeValue !== '' } : undefined
      }
      InputProps={{
        endAdornment:
          safeValue && !hideClear ? (
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
              aria-label="Очистить время"
              disabled={disabled}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : null,
      }}
    />
  );
}
