import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArticlesState } from "./types.ts";
import { Article, Filters } from "../../types.ts";

const initialState: ArticlesState = {
    ids: [],
    articles: [],
    recentlyViewed: [],
    filters: {}
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
        },
        setFilters: (state, action: PayloadAction<Filters>) => {
            state.filters = action.payload;
        }
    }
});

export const { setRecentlyViewedArticles, setIds, setArticlesData, setFilters } = articlesSlice.actions;

export default articlesSlice.reducer;
