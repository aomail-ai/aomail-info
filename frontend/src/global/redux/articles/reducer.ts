import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArticlesState } from "./types.ts";
import { Article } from "../../types.ts";

const initialState: ArticlesState = {
    ids: [],
    articles: [],
    recentlyViewed: []
};

const articlesSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        setRecentlyViewedArticles: (state, action: PayloadAction<Article[]>) => {
            state.recentlyViewed = action.payload.slice(0, 5);
        },
        setIds: (state, action: PayloadAction<string[]>) => {
            state.ids = action.payload;
        },
        setArticlesData: (state, action: PayloadAction<Article[]>) => {
            state.articles = action.payload;
        }
    }
});

export const { setRecentlyViewedArticles, setIds, setArticlesData } = articlesSlice.actions;

export default articlesSlice.reducer;
