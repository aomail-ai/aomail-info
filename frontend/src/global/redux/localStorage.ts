import { Article } from "../types.ts";

export const loadRecentlyViewedArticles = (): Article[] => {
    const recentlyViewedArticles = localStorage.getItem("recentlyViewedArticles");
    if (recentlyViewedArticles) {
        return JSON.parse(recentlyViewedArticles);
    }
    return [];
};

export const saveRecentlyViewedArticles = (articles: Article[]) => {
    localStorage.setItem("recentlyViewedArticles", JSON.stringify(articles));
};