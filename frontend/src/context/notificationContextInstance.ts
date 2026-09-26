import { createContext } from "react";

export type NotificationContextType = {
    notification: { type: string; message: string };
    showNotification: (type: string, message: string) => void;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
