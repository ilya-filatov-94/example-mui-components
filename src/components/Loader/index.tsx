import {FC} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Loader.module.css';

const Loader: FC = () => {
  return (
    <div className={styles.loader}>
      <p>Идёт загрузка </p>
      <div>
        <CircularProgress
          color="inherit"
          size={"1.5rem"}
          sx={{ marginTop: -1 }}
        />
      </div>
    </div>
  );
};

export default Loader;
