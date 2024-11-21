import { Article } from "../../types.ts";
import { SET_ARTICLES_DATA, SET_IDS, SET_RECENTLY_VIEWED_ARTICLES } from "./constants.ts";

export interface ArticlesState {
    ids: string[];
    articles: Article[];
    recentlyViewed: Article[];
}

interface SetArticlesDataAction {
    type: typeof SET_ARTICLES_DATA;
    payload: Article[];
}

interface SetIdsAction {
    type: typeof SET_IDS;
    payload: string[];
}

interface SetRecentlyViewedArticlesAction {
    type: typeof SET_RECENTLY_VIEWED_ARTICLES;
    payload: Article[];
}

export type ArticlesAction =
    | SetArticlesDataAction
    | SetIdsAction
    | SetRecentlyViewedArticlesAction;