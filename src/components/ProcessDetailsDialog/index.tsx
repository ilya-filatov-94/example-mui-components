import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CustomButton } from '../../components/CustomButton';
import { TemplateDialog } from '../../components/TemplateDialog';
import { useDataToastProgress } from '../../store/storeToastProgressBar';
import styles from './ProcessDetailsDialog.module.css';

export const ProcessDetailsDialog: FC = () => {
    const selectedProcessId = useDataToastProgress((state) => state.selectedProcessId);
    const openProcessDetails = useDataToastProgress((state) => state.openProcessDetails);
    const closeProcessDetails = useDataToastProgress((state) => state.closeProcessDetails);
    const process = useDataToastProgress(useShallow(
        state => state.listRunningProcesses.find(item => item.operationId === selectedProcessId)
    ));

    const open = Boolean(selectedProcessId);

    const handleKeyDialog = (e: KeyboardEvent, callback: () => void) => {
        if (e.code === 'Enter') {
            callback();
        }
    }

  return (
    <TemplateDialog
        isOpenDialog={open}
        openDialog={() => selectedProcessId ? openProcessDetails(selectedProcessId) : undefined}
        type="info"
        header={process?.header}
        content={
          <div className={styles.wrapperContentWindow}>
            <p>{process?.nameIntPoint}</p>
          </div>
        }
        footer={
          <div className={styles.wrapperButtons}>
            <CustomButton
              text="OK"
              onClick={closeProcessDetails}
              type="button"
            />
          </div>
        }
        width='900px'
        handleKeyEvent={(e) => {
          handleKeyDialog(
            e as unknown as KeyboardEvent, 
            closeProcessDetails
          )
        }}
      />
  )
}

