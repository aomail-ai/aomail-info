import { Article, Filters } from "../../types.ts";

export interface ArticlesState {
    ids: string[];
    articles: Article[];
    recentlyViewed: Article[];
    filters: Filters;
}
