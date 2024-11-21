import { SET_IS_CONNECTED, SET_USER_STATE } from "./constants.ts";

export interface UserState {
    language: string;
    isConnected: boolean;
    name: string;
    surname: string;
}

interface SetIsConnectedAction {
    type: typeof SET_IS_CONNECTED;
    payload: boolean;
}

interface SetUserStateAction {
    type: typeof SET_USER_STATE;
    payload: { language: string, isConnected: boolean, name: string, surname: string, };
}

export type UserAction =
    | SetIsConnectedAction
    | SetUserStateAction;