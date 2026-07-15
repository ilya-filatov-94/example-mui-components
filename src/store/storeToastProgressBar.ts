import { create } from 'zustand';
import { ProgressToastType, OttStands } from '../types/ProgressToastTypes';
import {
  getOperationIdForSendingPpd,
  getProgressSending,
} from '../services/ppdSendingService';

const TIME_DELAY_BETWEEN_RECURSIVE_REQUESTS = 6000;
const TIME_DELAY_BEFORE_COMPLETE_PROCESS = 2500;

export type TCurrentProgressState = {
  toastId?: string | number;
  header?: string;
};

type TDataSendingPpds = {
  listRunningProcesses: Array<ProgressToastType & TCurrentProgressState>;
  selectedProcessId: string | null;
  addNewSendPpd: (
    nameIntPoint: string,
    ottStand: OttStands,
    header: string,
  ) => Promise<string | undefined>;
  startPocessSendingPpd: (
    operationId: string,
    toastId: string | number,
    onComplete: () => void,
  ) => Promise<void>;
  runRecursiveProcess: (
    operationId: string,
    toastId: string | number,
    onComplete: () => void,
  ) => Promise<void>;
  openProcessDetails: (processId: string) => void;
  closeProcessDetails: () => void;
};

export const useDataToastProgress = create<TDataSendingPpds>((set, get) => ({
  listRunningProcesses: [],
  selectedProcessId: null,
  addNewSendPpd: async (nameIntPoint, ottStand, header) => {
    const response = await getOperationIdForSendingPpd(nameIntPoint, ottStand);

    if (response?.data) {
      const newProcess = {
        nameIntPoint,
        ottStand,
        operationId: response?.data,
        overallStatus: 'DEFAULT' as const,
        completedTargets: 0,
        totalTargets: 0,
        progress: 0,
        header,
      };
      set({
        listRunningProcesses: [
          ...(get().listRunningProcesses || []),
          newProcess,
        ],
      });
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
            : item,
        ),
      }));
      return;
    }

    if (response?.data) {
      const currentProgressData = response?.data;
      const currentState = get().listRunningProcesses?.find(
        item => item.operationId === operationId,
      );
      if (currentState) {
        // Обновляем существующий процесс, сохраняя все поля, но перезаписывая данные прогресса
        const updatedProcess = {
          ...currentState,
          ...currentProgressData,
          operationId: currentState.operationId,
          toastId,
        };
        const newArray = get().listRunningProcesses.map(item =>
          item.operationId === operationId ? updatedProcess : item,
        );
        set({ listRunningProcesses: newArray });
      } else {
        // Первый запуск процесса
        const newProcess = {
          ...currentProgressData,
          operationId,
          toastId,
        };
        set({
          listRunningProcesses: [
            ...(get().listRunningProcesses || []),
            newProcess,
          ],
        });
      }

      if (
        currentProgressData.completedTargets < currentProgressData.totalTargets
      ) {
        setTimeout(
          get().runRecursiveProcess,
          TIME_DELAY_BETWEEN_RECURSIVE_REQUESTS,
          operationId,
          toastId,
          onComplete,
        );
      } else {
        setTimeout(onComplete, TIME_DELAY_BEFORE_COMPLETE_PROCESS);
      }
    }
  },
  openProcessDetails: (processId: string) => {
    set({ selectedProcessId: processId });
  },
  closeProcessDetails: () => {
    set({ selectedProcessId: null });
  },
}));
