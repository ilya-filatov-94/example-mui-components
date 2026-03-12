import { FC, useState } from 'react';
import { CustomButton } from '../../components/CustomButton';
import { TemplateDialog } from '../../components/TemplateDialog';
import { ProgressBar } from '../../components/ProgressBar';
import styles from './DialogWithProgressBar.module.css';

const DialogWithProgressBar: FC = () => {
  const [stateDialog, setStateDialog] = useState({
    isOpen: false,
    header: 'Диалог с прогрессом',
    type: 'info'
  });
  const [stateProgress, setStateProgress] = useState({
    overallStatus: 'DEFAULT',
    completedTargets: 0,
    totalTargets: 4,
    progress: 0
  })

  const handleKeyDialog = (e: KeyboardEvent, callback: () => void) => {
    if (e.code === 'Enter') {
      callback();
    }
  }

  return (
    <>
      <CustomButton 
        text='Открыть окно'
        onClick={() => setStateDialog(prev => ({...prev, isOpen: true }))}
        type="button"
      />
      <TemplateDialog
        isOpenDialog={stateDialog?.isOpen}
        openDialog={(isOpen) => setStateDialog(prev => ({...prev, isOpen}))}
        type={stateDialog?.type}
        header={stateDialog.header}
        content={
          <div className={styles.wrapperContentWindow}>
            <ProgressBar 
              overallStatus={stateProgress?.overallStatus}
              completedTargets={stateProgress?.completedTargets}
              totalTargets={stateProgress?.totalTargets}
              progress={stateProgress?.progress}
            />
          </div>
        }
        footer={
          <div className={styles.wrapperButtons}>
            <CustomButton
              text="OK"
              onClick={() => setStateDialog(prev => ({...prev, isOpen: false }))}
              type="button"
            />
          </div>
        }
        width='900px'
        handleKeyEvent={(e) => {
          handleKeyDialog(
            e as unknown as KeyboardEvent, 
            () => setStateDialog(prev => ({...prev, isOpen: false}))
          )
        }}
      />
    </>
  )
}

export default DialogWithProgressBar;
 