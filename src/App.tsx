import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { ruRU as coreRuRu, ruRU } from '@mui/material/locale';
import Routing from './components/app/routing';
import './App.css';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#2f76da',
      },
      secondary: {
        main: '#ffffff'
      }
    },
    zIndex: {
      mobileStepper: 7006,
      speedDial: 70007,
      appBar: 7008,
      drawer: 7009,
      modal: 7010,
      snackbar: 7011,
      tooltip: 7012,
    }
  },
  ruRU,
  coreRuRu
);

export type AppTheme = ReturnType<typeof createTheme>;

const App: FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className='App'> 
          <Routing />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
