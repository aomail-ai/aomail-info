import { UserState } from "./redux/user/types.ts";

export const loadUserState = (): UserState => {
    const serializedState = localStorage.getItem("userState");
    if (!serializedState) {
        return {
            language: "en",
            isConnected: false,
            username: "",
            name: "",
            surname: "",
            id: -1,
            createdAt: ""
        };
    }
    return JSON.parse(serializedState);
};

export const saveUserState = (userState: UserState) => {
    const serializedState = JSON.stringify(userState);
    localStorage.setItem("userState", serializedState);
};