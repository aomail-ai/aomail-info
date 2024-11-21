import { RootState } from "../../types.ts";
import { createSelector } from "reselect";
import { UserState } from "./types.ts";

export const selectUserState = (state: RootState): UserState => state.user;


export const selectIsConnected = createSelector(
    selectUserState,
    (userState: UserState) => userState.isConnected
);