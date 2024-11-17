export const loadRecentlyViewedArticles = () => {
    const recentlyViewedArticles = localStorage.getItem("recentlyViewedArticles");
    if (recentlyViewedArticles) {
        return JSON.parse(recentlyViewedArticles);
    }
    return [];
};