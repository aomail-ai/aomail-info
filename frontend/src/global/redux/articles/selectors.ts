import { createSelector } from "reselect";
import { ArticlesState } from "./types.ts";
import { RootState } from "../../types.ts";

export const selectArticlesState = (state: RootState): ArticlesState => state.articles;


export const selectAllArticles = createSelector(
    selectArticlesState,
    (articlesState: ArticlesState) => articlesState.articles
);
