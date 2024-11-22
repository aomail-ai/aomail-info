import { UserState } from "./redux/user/types.ts";

export const loadUserState = (): UserState | null => {
    const serializedState = localStorage.getItem("userState");
    if (!serializedState) {
        return null;
    }
    return JSON.parse(serializedState);
};

export const saveUserState = (userState: UserState) => {
    const serializedState = JSON.stringify(userState);
    localStorage.setItem("userState", serializedState);
};