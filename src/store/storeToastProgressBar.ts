import { create } from 'zustand';
import { ProgressToastType, TottStand } from '../types/ProgressToastTypes';
import { getOperationIdForSendingPpd, getProgressSending } from '../services/ppdSendingService';

type TCurrentProgressState = {
    loading?: boolean;
    error?: string | null;
}

type TDataSendingPpds = {
    listRunningProcesses: Array<ProgressToastType & TCurrentProgressState>;
    addNewSendPpd: (nameIntPoint: string, ottStand: TottStand) => Promise<string | undefined>;
    startPocessSendingPpd: (operationId: string, onComplete: () => void) => Promise<void>;
    runRecursiveProcess: (operationId: string, onComplete: () => void) => Promise<void>;
}

export const useDataToastProgress = create<TDataSendingPpds>((set, get) => ({
    listRunningProcesses: [],
    addNewSendPpd: async (nameIntPoint: string, ottStand: TottStand) => {
        const response = await getOperationIdForSendingPpd(nameIntPoint, ottStand);

        if (response?.data) {
            return response.data;
        }
    },
    startPocessSendingPpd: async (operationId: string, onComplete) => {
        get().runRecursiveProcess(operationId, onComplete);
    },
    runRecursiveProcess: async (operationId: string, onComplete: () => void) => {
        const response = await getProgressSending(operationId);

        if (!response?.data) {
            // Если нет данных, возможно, ошибка. Обновим статус на FAILED.
            set(state => ({
                listRunningProcesses: state.listRunningProcesses.map(item =>
                    item.operationId === operationId
                        ? { ...item, overallStatus: 'FAILED' }
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
                };
                set({ listRunningProcesses: [...(get().listRunningProcesses || []), newProcess] });
            }

            if (currentProgressData.completedTargets < currentProgressData.totalTargets) {
                setTimeout(get().runRecursiveProcess, 6000, operationId, onComplete);
            } else {
                setTimeout(onComplete, 2500);
            }
        }
    }
    
}));