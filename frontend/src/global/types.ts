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
    id: string;
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