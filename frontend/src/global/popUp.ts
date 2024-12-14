import { POP_UP_ERROR_COLOR, POP_UP_SUCCESS_COLOR } from "./constants.ts";
import { Dispatch, SetStateAction } from "react";

export function displayErrorPopup(
    setShowNotification: Dispatch<SetStateAction<boolean>>,
    setNotificationTitle: Dispatch<SetStateAction<string>>,
    setNotificationMessage: Dispatch<SetStateAction<string>>,
    setBackgroundColor: Dispatch<SetStateAction<string>>,
    title: string,
    message: string
) {
    setBackgroundColor(POP_UP_ERROR_COLOR);
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
        setShowNotification(false);
    }, 4000);
}

export function displaySuccessPopup(
    setShowNotification: Dispatch<SetStateAction<boolean>>,
    setNotificationTitle: Dispatch<SetStateAction<string>>,
    setNotificationMessage: Dispatch<SetStateAction<string>>,
    setBackgroundColor: Dispatch<SetStateAction<string>>,
    title: string,
    message: string
) {
    setBackgroundColor(POP_UP_SUCCESS_COLOR);
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
        setShowNotification(false);
    }, 4000);
}
