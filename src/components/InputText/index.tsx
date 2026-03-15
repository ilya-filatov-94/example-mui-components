import { FC } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';


export const InputText: FC<TextFieldProps> = ({id, label, value, ...props}) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      sx={{
        width: '100%',
        minWidth: '200px',
        '& .MuiInputBase-input': {
            margin: 0,
            padding: '10px 10px',
            fontSize: '0.875rem'
        }
      }}
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  )
}

