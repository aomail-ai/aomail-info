import { SET_IDS, SET_ARTICLES_DATA, SET_RECENTLY_VIEWED_ARTICLES } from "./constants.ts";
import { Article } from "../../types.ts";

export const setIds = (ids: string[]) => ({
	type: SET_IDS,
	payload: ids,
});

export const setArticlesData = (articles: Article[]) => ({
	type: SET_ARTICLES_DATA,
	payload: articles,
});

export const setRecentlyViewedArticles = (articles: Article[]) => ({
	type: SET_RECENTLY_VIEWED_ARTICLES,
	payload: articles,
});