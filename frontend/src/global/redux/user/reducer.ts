import { UserState } from "./types.ts";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
    language: "en",
    isConnected: false,
    username: "",
    name: "",
    surname: "",
    id: -1,
    createdAt: ""
};

const articlesSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setUserState: (state, action) => {
            Object.assign(state, action.payload);
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        }
    }
});

export const { setIsConnected, setUserState, setLanguage } = articlesSlice.actions;

export default articlesSlice.reducer;
