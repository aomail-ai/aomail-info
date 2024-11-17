import { SET_ARTICLES_DATA, SET_IDS, SET_RECENTLY_VIEWED_ARTICLES } from "./constants.ts";
import { Article } from "../../types.ts";

interface ArticlesState {
    ids: string[];
    articles: Article[];
    recentlyViewed: Article[];
}

const initialState: ArticlesState = {
    ids: [],
    articles: [],
    recentlyViewed: []
};

export const articlesReducer = (state = initialState, action: any): ArticlesState => {
    switch (action.type) {
        case SET_RECENTLY_VIEWED_ARTICLES:
            return {
                ...state,
                recentlyViewed: action.payload.slice(0, 5)
            };
        case SET_IDS:
            return {
                ...state,
                ids: action.payload
            };
        case SET_ARTICLES_DATA:
            return {
                ...state,
                articles: action.payload
            };
        default:
            return state;
    }
};
