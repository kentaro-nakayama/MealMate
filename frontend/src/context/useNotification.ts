import { useContext } from "react";
import { NotificationContext } from "./notificationContextInstance";

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationはNotificationProviderの内部で使用する必要があります");
    }
    return context;
};
