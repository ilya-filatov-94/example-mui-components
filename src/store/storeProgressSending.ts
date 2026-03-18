import { create } from 'zustand';
import { ProgressBarProps } from '../types/ProgressPpdTypes';

type TCurrentProgressState = {
    loading?: boolean;
    error?: string | null;
}

type TDataSendingPpds = {
    listRunningProcesses: Array<ProgressBarProps & TCurrentProgressState>;
    addNewSendPpd: (operationId: string) => void;
    updateProgress: (operationId: string) => void;
    recursiveRetryRequest: (
        index: number, 
        operationId: string, 
        requestCallback: (index: number, operationId: string) => void, 
        successCallback: (operationId: string) => void,
        cancelledCallback: (operationId: string) => void,
        delay?: number
    ) => void;
    cancelProcess: (operationId: string) => void;
    deleteChosenProcess: (operationId: string) => void;
}

const arrayStatesOfProgress: Omit<ProgressBarProps, 'operationId'>[] = [
    {
        overallStatus: 'DEFAULT',
        completedTargets: 0,
        totalTargets: 4,
        progress: 0
    },
    {
        overallStatus: 'PENDING',
        completedTargets: 1,
        totalTargets: 4,
        progress: Math.round(1/4 * 100),
    },
    {
        overallStatus: 'PENDING',
        completedTargets: 2,
        totalTargets: 4,
        progress: Math.round(2/4 * 100),
    },
    {
        overallStatus: 'PENDING',
        completedTargets: 3,
        totalTargets: 4,
        progress: Math.round(3/4 * 100),
    },
    {
        overallStatus: 'COMPLETED',
        completedTargets: 4,
        totalTargets: 4,
        progress: Math.round(4/4 * 100),
    },
];

export const useDataSendingPpds = create<TDataSendingPpds>((set, get) => ({
    listRunningProcesses: [],
    addNewSendPpd: (operationId: string) => {
        const currentIndex = 0;
        const newSendPpd = {
            operationId,
            loading: true,
            error: null,
            ...arrayStatesOfProgress[currentIndex],
        }
        set({ listRunningProcesses: [...get().listRunningProcesses, newSendPpd] });
    },
    updateProgress: (operationId: string) => {
        const currentIndex = 0;
        get().recursiveRetryRequest(
            currentIndex,
            operationId,
            (index, operationId) => {
                const currentState = get().listRunningProcesses?.find(item => item.operationId === operationId);
                console.log(currentState)
                let newProgressSendPpd;
                if (currentState) {
                    const newData = arrayStatesOfProgress[index];
                    newProgressSendPpd = {
                        operationId,
                        loading: true,
                        error: null,
                        ...newData,
                    };
                    const oldArray = get().listRunningProcesses?.filter(item => item.operationId !== operationId);
                    set({ listRunningProcesses: [...oldArray, newProgressSendPpd] });
                }
            },
            (operationId) => {
                const currentState = get().listRunningProcesses?.find(item => item.operationId === operationId);
                if (currentState) {
                    const newProgressSendPpd = {
                        ...currentState,
                        loading: false,
                        error: null,
                    };
                    const oldArray = get().listRunningProcesses?.filter(item => item.operationId !== operationId);
                    set({ listRunningProcesses: [...oldArray, newProgressSendPpd] });
                }
            },
            (operationId) => {
                console.log('Отменено');
            }
        );
    },
    recursiveRetryRequest: (
        index: number,
        operationId: string,
        requestCallback: (index: number, operationId: string) => void, 
        successCallback: (operationId: string) => void,
        cancelledCallback: (operationId: string) => void,
        delay = 2000
    ) => {
        console.log(index);
        const isCancelled = get()?.listRunningProcesses?.find(item => item.operationId === operationId)?.overallStatus === 'CANCELLED';
        if (index < 5 && !isCancelled) {
            requestCallback(index, operationId);
            const newIndex =  index + 1;
            setTimeout(
                get().recursiveRetryRequest, 
                delay, 
                newIndex, 
                operationId, 
                requestCallback, 
                successCallback, 
                cancelledCallback
            );
        } else if (isCancelled) {
            cancelledCallback(operationId);
        } else {
            successCallback(operationId);
        }
    },
    cancelProcess: (operationId: string) => {
        const currentState = get().listRunningProcesses?.find(item => item.operationId === operationId);
        if (currentState) {
            const newProgressSendPpd = {
                ...currentState,
                overallStatus: 'CANCELLED' as typeof currentState.overallStatus,
                loading: false,
            };
            const oldArray = get().listRunningProcesses?.filter(item => item.operationId !== operationId);
            set({ listRunningProcesses: [...oldArray, newProgressSendPpd] });
        }
    },
    deleteChosenProcess: (operationId: string) => {
        const newProcesses = get().listRunningProcesses?.filter(item => item.operationId !== operationId);
        set({ listRunningProcesses: newProcesses });
    }
}));