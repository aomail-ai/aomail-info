import { SET_IS_CONNECTED, SET_USER_STATE } from "./constants.ts";
import { UserState } from "./types.ts";

export const setIsConnected = (isConnected: boolean) => ({
    type: SET_IS_CONNECTED,
    payload: isConnected
});


export const setUserState = (userState: UserState) => ({
    type: SET_USER_STATE,
    payload: userState
});