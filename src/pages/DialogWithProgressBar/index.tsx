import { FC, useEffect, useState } from 'react';
// import { nanoid } from 'nanoid';
// import { ProgressBarProps } from '../../types/ProgressPpdTypes';
import { useDataSendingPpds } from '../../store/storeProgressSending';
import { CustomButton } from '../../components/CustomButton';
import { TemplateDialog } from '../../components/TemplateDialog';
import { ProgressBar } from '../../components/ProgressBar';
import styles from './DialogWithProgressBar.module.css';

const DialogWithProgressBar: FC = () => {
  const currentOperationId = '123';
  const currentRunningProcess = useDataSendingPpds((state) => {
    return  state.listRunningProcesses?.find((item) => item.operationId === currentOperationId);
  });
  const addNewSendPpd = useDataSendingPpds((state) => state.addNewSendPpd);
  const updateProgress = useDataSendingPpds((state) => state.updateProgress);
  const cancellProgress = useDataSendingPpds((state) => state.cancelProcess);
  const deleteComplitedProcessSendPpd = useDataSendingPpds((state) => state.deleteChosenProcess);

  const [stateDialog, setStateDialog] = useState({
    isOpen: false,
    header: 'Диалог с прогрессом',
    type: 'info'
  });

  useEffect(() => {
    if (stateDialog?.isOpen && currentRunningProcess?.loading) {
      updateProgress(currentOperationId);
    }
  }, [stateDialog])

  const handleKeyDialog = (e: KeyboardEvent, callback: () => void) => {
    if (e.code === 'Enter') {
      callback();
    }
  }

  const startProcess = () => {
    const operationId = currentOperationId; // Достаём из LocalStorage или получаем с бэка?
    addNewSendPpd(operationId);
    setStateDialog(prev => ({...prev, isOpen: true }));
  }

  const checkDisableStopButton = (status: string) => {
    const isOver = (status === 'COMPLETED' || 
      status === 'PARTIALLY_COMPLETED' || 
      status === 'FAILED' || 
      status === 'CANCELLED');
    return isOver;
  }

  return (
    <>
      <div className={styles.wrapperPage}>
        <CustomButton 
          text='Открыть окно'
          onClick={startProcess}
          type="button"
        />
      </div>
      <TemplateDialog
        isOpenDialog={stateDialog?.isOpen}
        openDialog={(isOpen) => setStateDialog(prev => ({...prev, isOpen}))}
        type={stateDialog?.type}
        header={stateDialog.header}
        content={
          <div className={styles.wrapperContentWindow}>
            <ProgressBar 
              overallStatus={currentRunningProcess?.overallStatus || 'DEFAULT'}
              completedTargets={currentRunningProcess?.completedTargets || 0}
              totalTargets={currentRunningProcess?.totalTargets || 0}
              progress={currentRunningProcess?.progress}
            />
          </div>
        }
        footer={
          <div className={styles.wrapperButtons}>
            <CustomButton
              text="OK"
              onClick={() => {
                setStateDialog(prev => ({...prev, isOpen: false }));
                deleteComplitedProcessSendPpd(currentOperationId);
              }}
              type="button"
            />
            <CustomButton
              text="Stop"
              disabled={checkDisableStopButton(currentRunningProcess?.overallStatus || '')}
              bgColor='#db4742'
              bgActiveColor='#db5e5a'
              bgHoverColor='#bc1c17'
              onClick={() => {
                cancellProgress(currentOperationId);
              }}
              type="reset"
            />
          </div>
        }
        width='900px'
        handleKeyEvent={(e) => {
          handleKeyDialog(
            e as unknown as KeyboardEvent, 
            () => {
              setStateDialog(prev => ({...prev, isOpen: false}));
              deleteComplitedProcessSendPpd(currentOperationId);
            }
          )
        }}
      />
    </>
  )
}

export default DialogWithProgressBar;
 