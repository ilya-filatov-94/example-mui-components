import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { ruRU as coreRuRu, ruRU } from '@mui/material/locale';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    <div className='App'> 
     <BrowserRouter future={{v7_startTransition: false}}>
      <ThemeProvider theme={theme}>
        <Routing />
      </ThemeProvider>
     </BrowserRouter>
     <ToastContainer 
        containerId="notifications"
        position="bottom-left"
        newestOnTop
        hideProgressBar
        autoClose={3500}
        theme="light"
        style={{ width: '38vw', whiteSpace: 'pre-wrap'}}
      />
      <ToastContainer 
        containerId="progressBar"
        position="bottom-right"
        newestOnTop
        hideProgressBar
        autoClose={false}
        closeOnClick={false}
        closeButton={false}
        theme="light"
        style={{ width: 'auto', maxWidth: '600px' }} // адаптивная ширина
      />
    </div>
  );
};

export default App;
