import { Checkbox, ListItemText, MenuItem, Select } from '@mui/material';

interface CompositionMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  disabledOptions?: Set<string>;
  placeholder?: string;
}

export function CompositionMultiSelect({
  value,
  onChange,
  options,
  disabledOptions,
  placeholder = 'Не выбрано',
}: CompositionMultiSelectProps) {
  return (
    <Select
      multiple
      value={value}
      onChange={e => onChange(e.target.value as string[])}
      size="small"
      fullWidth
      displayEmpty
      renderValue={selected => {
        const arr = selected as string[];
        return arr.length === 0 ? placeholder : arr.join(', ');
      }}
    >
      {options.map(option => (
        <MenuItem
          key={option}
          value={option}
          disabled={disabledOptions?.has(option)}
        >
          <Checkbox checked={value.includes(option)} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  );
}
