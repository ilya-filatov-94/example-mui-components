import axios, { AxiosResponse } from 'axios';
import { TottStand, ProgressToastType } from '../types/ProgressToastTypes';
import { addNotification } from '../utils/notifications';

export function getOperationIdForSendingPpd(nameIntPoint: string, ottStand: TottStand): Promise<void | AxiosResponse<string>> {
    const apiUrl = process.env.REACT_APP_API_URL;
    return axios.post<string>(apiUrl + '/ppd/create-sending',
        { nameIntPoint, ottStand },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    .then((response) => response)
    .catch((error: unknown) => {
        if (error instanceof axios.AxiosError) {
            addNotification('error', 'Ошибка запроса operationId');
        }
    })
};

export function getProgressSending(operationId: string): Promise<void | AxiosResponse<ProgressToastType>> {
    const apiUrl = process.env.REACT_APP_API_URL;
    return axios.get<ProgressToastType>(apiUrl + '/ppd/rule-status', {
            params: { operationId }
        }
    )
    .then(response => response)
    .catch((error: unknown) => {
        if (error instanceof axios.AxiosError) {
            addNotification('error', 'Ошибка запроса получения текущего прогресса');
        }
    });
}
