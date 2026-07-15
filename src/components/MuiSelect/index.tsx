import { useId, memo, CSSProperties } from 'react';
import type { SxProps } from '@mui/system';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export type ItemListSelect<T = string> = {
  name: string;
  value: T;
};

interface MuiSelectProps<T = string> extends Omit<
  SelectProps<T>,
  'label' | 'onChange' | 'value'
> {
  label?: string; // режим с лейблом (стандартный)
  placeholder?: string; // режим только с плейсхолдером
  selectedValue: T;
  listValues: ItemListSelect<T>[];
  handlerSelect: (value: T) => void;
  required?: boolean;
  minWidth?: number;
  isError?: boolean;
  stylesSelect?: SxProps; // SxProps для поддержки псевдоклассов, темы mui и медиа-запросов
  stylesForm?: SxProps; // SxProps для поддержки псевдоклассов, темы mui и медиа-запросов
}

function MuiSelectInner<T extends string | number = string>(
  props: MuiSelectProps<T>,
) {
  const {
    label,
    selectedValue,
    listValues,
    handlerSelect,
    minWidth,
    stylesForm,
    stylesSelect,
    placeholder,
    required = false,
    isError = false,
    ...selectProps
  } = props;

  const reactId = useId();
  const formControlId = label
    ? `select-label-${reactId}`
    : `select-placeholder-${reactId}`;

  const renderPlaceholderValue = (selected: T) => {
    if (
      !selected ||
      (Array.isArray(selected) && selected.length === 0) ||
      selected === ''
    ) {
      return (
        <Typography sx={{ color: 'text.secondary' }}>{placeholder}</Typography>
      );
    }
    const item = listValues.find(i => i.value === selected);
    return item ? item.name : String(selected);
  };

  return (
    <FormControl
      size="small"
      fullWidth
      id={`id-label-select-${formControlId}`}
      sx={{
        height: '100%',
        minWidth,
        '.MuiFormControl-root': { margin: '0 !important' },
        '& .MuiSelect-select': {
          color: 'text.secondary',
        },
        ...stylesForm,
      }}
      required={required}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        labelId={`id-label-${formControlId}`}
        id={`id-select-${formControlId}`}
        label={label}
        displayEmpty={!label}
        renderValue={!label ? renderPlaceholderValue : undefined}
        value={selectedValue}
        onChange={(event: SelectChangeEvent<T>) => {
          handlerSelect(event.target.value as T);
        }}
        sx={{
          border: isError ? '2px solid red' : 'none',
          ...stylesSelect,
        }}
        {...selectProps}
      >
        {listValues?.map(item => (
          <MenuItem
            key={String(item.value)}
            value={item.value}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const MuiSelect = memo(MuiSelectInner) as <
  T extends string | number = string,
>(
  props: MuiSelectProps<T>,
) => JSX.Element;
