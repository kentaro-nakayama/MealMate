import { useEffect, useState, type ReactNode } from "react";
import { NotificationContext } from "./notificationContextInstance";

type NotificationProviderProps = {
    children: ReactNode;
};

const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notification, setNotification] = useState({ type: '', message: '' });
    const showNotification = (type: string, message: string) => {
        setNotification({ type, message });
    }
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export { NotificationProvider };
