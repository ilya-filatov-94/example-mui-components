import { FC, useState, ChangeEvent } from 'react';
import { toast } from "react-toastify";
import { TottStand } from '../../types/ProgressToastTypes';
import { addNotification } from '../../utils/notifications';
import { CustomButton } from '../../components/CustomButton';
import { InputText } from '../../components/InputText';
// import { TemplateDialog } from '../../components/TemplateDialog';
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
      // Показываем тост и запоминаем его id
      const toastId = toast(
        <ProgressToast 
          operationId={operationId || ''}
          nameIntPoint={dataProcess.nameIntPoint}
          ottStand={dataProcess.ottStand as TottStand} 
        />,
        {
          type: 'info',
          containerId: 'progressBar',
          autoClose: false,
          closeOnClick: false,
        }
      );

      // Запускаем процесс и передаём колбэк для закрытия тоста
      startPocessSendingPpd(operationId, () => {
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
