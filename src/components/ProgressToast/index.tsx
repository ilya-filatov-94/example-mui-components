import { FC, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { toast } from "react-toastify";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { TottStand, ProgressToastType } from '../../types/ProgressToastTypes';
import { useDataToastProgress, TCurrentProgressState } from '../../store/storeToastProgressBar';
import { getStatusProgress } from '../ProgressBar';
import styles from './ProgressToast.module.css';

type ProgressToastProps = {
  operationId: string;
  nameIntPoint: string;
  ottStand: TottStand;
}

export const ProgressToast: FC<ProgressToastProps> = ({ 
  operationId,
  nameIntPoint,
  ottStand
}) => {
  const process = useDataToastProgress(useShallow(
    state => state.listRunningProcesses.find(item => item.operationId === operationId)
  ));
  const { color } = getStatusProgress(process?.overallStatus || 'DEFAULT');

  const handleClose = useCallback((process: ProgressToastType & TCurrentProgressState | undefined) => {
    toast.dismiss(process?.toastId);
  }, []);

  return (
    <div className={styles.wrapperContent}>
      <p className={styles.wrapperHeaderContent}>Отправка ППД</p>
      <div className={styles.wrapperLabelItem}>
        <p className={styles.wrapperLabel}>имя ТчВ:</p>
        <p className={styles.wrapperLabel}>{nameIntPoint}</p>
      </div>
      <div className={styles.wrapperLabelItem}>
        <p className={styles.wrapperLabel}>стенд:</p>
        <p className={styles.wrapperLabel}>{ottStand}</p>
      </div>
      <div className={styles.wrapperLabelItem}>
        <p className={styles.wrapperLabel}>id операции:</p>
        <p className={styles.wrapperLabel}>{operationId}</p>
      </div>
      <div className={styles.wprapperProgressLine}>
        <div className={styles.wrapperChipComponent}>
          <Chip
            label={`${process?.completedTargets || 0} / ${process?.totalTargets || 0}`}
            variant='outlined'
            color={color}
          />
        </div>
        <LinearProgress 
          variant='determinate'
          value={process?.progress || 0}
          color={color as LinearProgressProps['color']}
          sx={{ height: 10, borderRadius: 5, mb: '3px'}}
        />
        <p className={styles.textProgress}>
          {process?.progress || 0}% завершено
        </p>  
      </div>
      {process?.overallStatus === 'FAILED' && (
        <button
          onClick={() => handleClose(process)}
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          ✕
        </button>
      )}
    </div>
  )
}

