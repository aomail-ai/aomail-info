import { ArticlesState } from "./redux/articles/types.ts";
import { UserState } from "./redux/user/types.ts";

export interface FetchDataResult {
    success: boolean;
    data?: any;
    error?: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Reaction {
    id: string;
    type: string;
}

export interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    miniatureUrl: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    reactions: Reaction[];
    Tags: Tag[];
}

export interface RootState {
    articles: ArticlesState;
    user: UserState;
}