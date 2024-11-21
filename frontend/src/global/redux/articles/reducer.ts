import { SET_ARTICLES_DATA, SET_IDS, SET_RECENTLY_VIEWED_ARTICLES } from "./constants.ts";
import { ArticlesAction, ArticlesState } from "./types.ts";


const initialState: ArticlesState = {
    ids: [],
    articles: [],
    recentlyViewed: []
};

export const articlesReducer = (state = initialState, action: ArticlesAction): ArticlesState => {
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
