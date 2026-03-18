import { FC, useState, ChangeEvent } from 'react';
import { toast } from "react-toastify";
import { TottStand } from '../../types/ProgressToastTypes';
import { addNotification } from '../../utils/notifications';
import { CustomButton } from '../../components/CustomButton';
import { InputText } from '../../components/InputText';
import { ProgressToast } from '../../components/ProgressToast';
import { useDataToastProgress } from '../../store/storeToastProgressBar';
import styles from './ProgressBarInNotification.module.css';

const ProgressBarInNotification: FC = () => {
  const [dataProcess, setDataProcess] =  useState<{nameIntPoint: string, ottStand: string }>({
    nameIntPoint: '',
    ottStand: ''
  })
  const addNewSendPpd = useDataToastProgress((state) => state.addNewSendPpd);
  const startPocessSendingPpd = useDataToastProgress((state) => state.startPocessSendingPpd);

  const handlerInput = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const newValue = e.target.value;
    setDataProcess(prev => ({...prev, [id]: newValue }));
  }

  const openNotification = () => {
    addNotification('info', 'Уведомление');
  };

  const startProcessSendingPpd = async () => {
    let operationId;
    if (dataProcess.nameIntPoint !== '' && dataProcess.ottStand !== '') {
      operationId = await addNewSendPpd(
        dataProcess.nameIntPoint, 
        dataProcess.ottStand as TottStand,
      );
    }

    if (operationId) {
      const toastId: number | string = toast(
        <ProgressToast 
          operationId={operationId}
          nameIntPoint={dataProcess.nameIntPoint}
          ottStand={dataProcess.ottStand as TottStand} 
        />,
        {
          containerId: 'progressBar',
          autoClose: false,
          closeOnClick: false,
          style: { 
            border: '1px solid #b5d4ff',
            borderRadius: '10px' 
          }
        }
      );

      // Запускаем процесс и передаём колбэк для закрытия тоста
      startPocessSendingPpd(operationId, toastId, () => {
        toast.dismiss(toastId);
      });
    }
  };

  return (
    <div className={styles.wrapperPage}>
      <div className={styles.wrapperItem}>
        <InputText 
          id="nameIntPoint" 
          label="Введите имя ТчВ" 
          value={dataProcess.nameIntPoint} 
          onChange={handlerInput}
        />
        <InputText 
          id="ottStand" 
          label="Введите стенд" 
          value={dataProcess.ottStand} 
          onChange={handlerInput}
        />
      </div>
      <CustomButton 
        text='Показать уведомление'
        onClick={openNotification}
        type="button"
      />
      <CustomButton 
        text='Запустить отправку'
        onClick={startProcessSendingPpd}
        type="button"
      />
    </div>
  )
}

export default ProgressBarInNotification;
