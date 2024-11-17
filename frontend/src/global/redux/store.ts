import { configureStore } from "@reduxjs/toolkit";
import { articlesReducer } from "./articles/reducer.ts";


const store = configureStore({
    reducer: {
        articles: articlesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;