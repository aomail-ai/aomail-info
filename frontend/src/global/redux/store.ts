import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articles/reducer.ts";
import userReducer from "./user/reducer.ts";


const store = configureStore({
    reducer: {
        articles: articlesReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;