import { useId, memo, CSSProperties } from 'react';
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
  stylesSelect?: CSSProperties;
  stylesForm?: CSSProperties;
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

  // Если передан label – рендерим обычный Select с InputLabel
  if (label) {
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
        <InputLabel>{label}</InputLabel>
        <Select
          labelId={`id-label-${formControlId}`}
          id={`id-select-${formControlId}`}
          label={label}
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
              value={item.value as any}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // Иначе – placeholder через renderValue и displayEmpty
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
      <Select
        labelId={`id-label-${formControlId}`}
        id={`id-select-${formControlId}`}
        displayEmpty
        value={selectedValue}
        onChange={(event: SelectChangeEvent<T>) => {
          handlerSelect(event.target.value as T);
        }}
        sx={{
          border: isError ? '2px solid red' : 'none',
          ...stylesSelect,
        }}
        renderValue={selected => {
          if (
            !selected ||
            (Array.isArray(selected) && selected.length === 0) ||
            selected === ''
          ) {
            return (
              <Typography sx={{ color: 'text.secondary' }}>
                {placeholder}
              </Typography>
            );
          }
          const item = listValues.find(i => i.value === selected);
          return item ? item.name : String(selected);
        }}
        {...selectProps}
      >
        {listValues?.map(item => (
          <MenuItem
            key={String(item.value)}
            value={item.value as any}
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
