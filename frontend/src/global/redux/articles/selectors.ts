import { createSelector } from "reselect";
import { ArticlesState } from "./types.ts";
import { RootState } from "../../types.ts";

export const selectArticlesState = (state: RootState): ArticlesState => state.articles;


export const selectAllArticles = createSelector(
    selectArticlesState,
    (articlesState: ArticlesState) => articlesState.articles
);

export const selectFetchIds = createSelector(
    selectArticlesState,
    (articlesState: ArticlesState) => articlesState.ids
);

export const selectFilters = createSelector(
    selectArticlesState,
    (articlesState: ArticlesState) => articlesState.filters
);