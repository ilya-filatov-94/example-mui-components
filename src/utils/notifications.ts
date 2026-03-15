import { toast } from "react-toastify";

type TypeNotification = 'info' | 'success' | 'warning' | 'error';

export function addNotification(type: TypeNotification, msgNotification: string | JSX.Element) {
    toast(msgNotification, {
        containerId: "notifications",
        type,
        style: {
            marginTop: '10px',
            border: type === 'error' ? '2px solid red' : 'inherit',
        }
    })
}