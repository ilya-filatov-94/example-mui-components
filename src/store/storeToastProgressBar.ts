import { create } from 'zustand';
import { ProgressToastType, TottStand } from '../types/ProgressToastTypes';
import { getOperationIdForSendingPpd, getProgressSending } from '../services/ppdSendingService';

export type TCurrentProgressState = {
    loading?: boolean;
    error?: string | null;
    toastId?: string | number;
}

type TDataSendingPpds = {
    listRunningProcesses: Array<ProgressToastType & TCurrentProgressState>;
    addNewSendPpd: (nameIntPoint: string, ottStand: TottStand) => Promise<string | undefined>;
    startPocessSendingPpd: (operationId: string, toastId: string | number, onComplete: () => void) => Promise<void>;
    runRecursiveProcess: (operationId: string, toastId: string | number, onComplete: () => void) => Promise<void>;
}

export const useDataToastProgress = create<TDataSendingPpds>((set, get) => ({
    listRunningProcesses: [],
    addNewSendPpd: async (nameIntPoint, ottStand) => {
        const response = await getOperationIdForSendingPpd(nameIntPoint, ottStand);

        if (response?.data) {
            return response.data;
        }
    },
    startPocessSendingPpd: async (operationId, toastId, onComplete) => {
        get().runRecursiveProcess(operationId, toastId, onComplete);
    },
    runRecursiveProcess: async (operationId, toastId, onComplete) => {
        const response = await getProgressSending(operationId);

        if (!response?.data) {
            // Если нет данных, возможно, ошибка. Обновим статус на FAILED.
            set(state => ({
                listRunningProcesses: state.listRunningProcesses.map(item =>
                    item.operationId === operationId
                        ? { ...item, overallStatus: 'FAILED', toastId }
                        : item
                )
            }));
            return;
        }

        if (response?.data) {
            const currentProgressData  = response?.data;
            const currentState = get().listRunningProcesses?.find(item => item.operationId === operationId);
            if (currentState) {
                // Обновляем существующий процесс, сохраняя все поля, но перезаписывая данные прогресса
                const updatedProcess = {
                    ...currentState,
                    ...currentProgressData,
                    operationId: currentState.operationId,
                    toastId,
                };
                const newArray = get().listRunningProcesses.map(item =>
                    item.operationId === operationId ? updatedProcess : item
                );
                set({ listRunningProcesses: newArray });
            } else {
                // Первый запуск процесса
                const newProcess = {
                    ...currentProgressData,
                    operationId,
                    toastId,
                };
                set({ listRunningProcesses: [...(get().listRunningProcesses || []), newProcess] });
            }

            if (currentProgressData.completedTargets < currentProgressData.totalTargets) {
                setTimeout(get().runRecursiveProcess, 6000, operationId, toastId, onComplete);
            } else {
                setTimeout(onComplete, 2500);
            }
        }
    }
    
}));