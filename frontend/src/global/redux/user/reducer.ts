import { UserAction, UserState } from "./types.ts";
import { SET_IS_CONNECTED, SET_LANGUAGE, SET_USER_STATE } from "./constants.ts";

const initialState: UserState = {
    language: "en",
    isConnected: false,
    name: "",
    surname: ""
};

export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case SET_IS_CONNECTED:
            return {
                ...state,
                isConnected: action.payload
            };
        case SET_USER_STATE:
            return {
                ...state,
                ...action.payload
            };
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            };
        default:
            return state;
    }
};
