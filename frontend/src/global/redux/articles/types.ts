import { Article } from "../../types.ts";

export interface ArticlesState {
    ids: string[];
    articles: { [id: string]: Article };
    loading: boolean;
    error: string | null;
}
