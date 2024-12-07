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
    miniatureFileName: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    reactions: Reaction[];
    Tags: Tag[];
}

export interface Filters {
    userId?: number;
    search?: string;
    title?: string;
    description?: string;
    content?: string;
    authorName?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    minReactions?: number;
    maxReactions?: number;
    advanced?: boolean;
    sort?: string;
    order?: string;
}

export interface RootState {
    articles: ArticlesState;
    user: UserState;
}