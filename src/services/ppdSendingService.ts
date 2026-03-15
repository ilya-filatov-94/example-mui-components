import axios, { AxiosResponse } from 'axios';
import { TottStand, ProgressToastType } from '../types/ProgressToastTypes';
import { addNotification } from '../utils/notifications';

export async function getOperationIdForSendingPpd(nameIntPoint: string, ottStand: TottStand): Promise<void | AxiosResponse<string>> {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        return await axios.post<string>(apiUrl + '/ppd/create-sending',
            { nameIntPoint, ottStand },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    } catch (error) {
        if (error instanceof axios.AxiosError) {
            addNotification('error', 'Ошибка запроса operationId');
        }
    }
};

export async function getProgressSending(operationId: string): Promise<void | AxiosResponse<ProgressToastType>> {
        const apiUrl = process.env.REACT_APP_API_URL;
    try {
        return await axios.get<ProgressToastType>(apiUrl + '/ppd/rule-status', {
            params: {
                operationId
            }
        });
    } catch (error) {
        if (error instanceof axios.AxiosError) {
            addNotification('error', 'Ошибка запроса получения текущего прогресса');
        }
    }
}