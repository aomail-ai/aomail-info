import { SET_IS_CONNECTED, SET_LANGUAGE, SET_USER_STATE } from "./constants.ts";

export interface UserState {
    language: string;
    isConnected: boolean;
    username: string;
    name: string;
    surname: string;
    id: number;
    createdAt: string;
}

interface SetIsConnectedAction {
    type: typeof SET_IS_CONNECTED;
    payload: boolean;
}

interface SetLanguageAction {
    type: typeof SET_LANGUAGE;
    payload: string;
}

interface SetUserStateAction {
    type: typeof SET_USER_STATE;
    payload: {
        language: string,
        isConnected: boolean,
        username: string,
        surname: string,
        id: number,
        createdAt: string
    };
}

export type UserAction =
    | SetIsConnectedAction
    | SetUserStateAction
    | SetLanguageAction;