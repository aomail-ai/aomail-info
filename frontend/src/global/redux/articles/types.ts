import { Article } from "../../types.ts";

export interface ArticlesState {
    ids: string[]; // List of article IDs
    articles: { [id: string]: Article }; // Articles mapped by their ID
    loading: boolean;
    error: string | null;
}
