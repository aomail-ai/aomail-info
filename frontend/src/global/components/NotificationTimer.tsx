import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";


type NotificationTimerProps = {
    showNotification: boolean;
    notificationTitle: string
    notificationMessage: string
    backgroundColor?: string;
    onDismiss: () => void;
};

const NotificationTimer: React.FC<NotificationTimerProps> = ({
                                                                 showNotification,
                                                                 notificationTitle,
                                                                 notificationMessage,
                                                                 backgroundColor,
                                                                 onDismiss
                                                             }) => {
    const [showNotificationInternal, setShowNotificationInternal] = useState(showNotification);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (showNotification) {
            setShowNotificationInternal(true);
            timerId = setTimeout(() => {
                dismissPopup();
            }, 4000);
        } else {
            setShowNotificationInternal(false);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [showNotification]);

    const dismissPopup = () => {
        setShowNotificationInternal(false);
        if (onDismiss) {
            onDismiss();
        }
    };

    if (!showNotificationInternal) {
        return null;
    }

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
            style={{ zIndex: 50 }}
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                <div
                    className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${backgroundColor}`}
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">{notificationTitle}</p>
                                <p className="mt-1 text-sm text-gray-900">{notificationMessage}</p>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={dismissPopup}
                                    className="inline-flex rounded-md text-gray-900 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                                >
                                    <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationTimer;