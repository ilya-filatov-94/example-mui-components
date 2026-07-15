import { FC, useState, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { OttStands } from '../../types/ProgressToastTypes';
import { addNotification } from '../../utils/notifications';
import { CustomButton } from '../../components/CustomButton';
import { InputText } from '../../components/InputText';
import { MuiSelect, ItemListSelect } from '../../components/MuiSelect';
import { ProgressToast } from '../../components/ProgressToast';
import { useDataToastProgress } from '../../store/storeToastProgressBar';
import styles from './ProgressBarInNotification.module.css';

const listStands: ItemListSelect<OttStands>[] = [
  {
    name: 'ИФТ',
    value: 'IFT',
  },
  {
    name: 'ПСИ',
    value: 'PSI',
  },
  {
    name: 'НТ',
    value: 'NT',
  },
  {
    name: 'ПРОМ',
    value: 'PROM',
  },
];

const ProgressBarInNotification: FC = () => {
  const [selectedStand, selectStand] = useState<OttStands | ''>('');
  const [dataProcess, setDataProcess] = useState<{
    nameIntPoint: string;
    ottStand: OttStands;
  }>({
    nameIntPoint: '',
    ottStand: '' as OttStands,
  });
  const addNewSendPpd = useDataToastProgress(state => state.addNewSendPpd);
  const startPocessSendingPpd = useDataToastProgress(
    state => state.startPocessSendingPpd,
  );

  const handlerInput = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const newValue = e.target.value;
    setDataProcess(prev => ({ ...prev, [id]: newValue }));
  };

  const handlerSelectStand = (choosenStand: OttStands) => {
    selectStand(choosenStand);
  };

  const openNotification = () => {
    addNotification('info', 'Уведомление');
  };

  const startProcessSendingPpd = async () => {
    let operationId;
    let policyType = 'Ott';
    if (dataProcess.nameIntPoint !== '' && !!dataProcess.ottStand) {
      operationId = await addNewSendPpd(
        dataProcess.nameIntPoint,
        dataProcess.ottStand as OttStands,
        `Результат отправки СППД ${policyType ? `в ОТТ` : ''} ${dataProcess.ottStand} стенд`,
      );
    }

    if (operationId) {
      const toastId: number | string = toast(
        <ProgressToast
          operationId={operationId}
          nameIntPoint={dataProcess.nameIntPoint}
          ottStand={dataProcess.ottStand as OttStands}
        />,
        {
          containerId: 'progressBar',
          autoClose: false,
          closeOnClick: false,
          style: {
            border: '1px solid #b5d4ff',
            borderRadius: '10px',
          },
        },
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
        <MuiSelect<OttStands>
          placeholder="Выберите стенд"
          selectedValue={selectedStand as OttStands}
          listValues={listStands}
          handlerSelect={handlerSelectStand}
          minWidth={230}
        />
        {/* <MuiSelect
          placeholder="Выберите стенд"
          selectedValue={selectedStand as string}
          listValues={listStands as ItemListSelect[]}
          handlerSelect={handlerSelectStand}
          minWidth={230}
        /> */}
      </div>
      <CustomButton
        text="Показать уведомление"
        onClick={openNotification}
        type="button"
      />
      <CustomButton
        text="Запустить отправку"
        onClick={startProcessSendingPpd}
        type="button"
      />
    </div>
  );
};

export default ProgressBarInNotification;
