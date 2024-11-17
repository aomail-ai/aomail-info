import { createSelector } from "reselect";
import { ArticlesState } from "./types.ts";

export const selectArticlesState = (state: any): ArticlesState => state.articles;

export const selectArticleIds = createSelector(
    selectArticlesState,
    (articlesState) => articlesState.ids
);


export const selectArticleById = (id: string) =>
    createSelector(selectArticlesState, (articlesState) => articlesState.articles[id]);

export const selectAllArticles = createSelector(
    selectArticlesState,
    (articlesState) => articlesState.articles
);

export const selectLoadingState = createSelector(
    selectArticlesState,
    (articlesState) => articlesState.loading
);

export const selectErrorState = createSelector(
    selectArticlesState,
    (articlesState) => articlesState.error
);
