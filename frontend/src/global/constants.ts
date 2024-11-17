import { Article } from "./types.ts";

export const AOMAIL_APP_URL = "https://app.aomail.ai/";
export const API_BASE_URL = "http://localhost:8080/api/";

export const articles: Article[] = [
    {
        authorName: "John Doe",
        createdAt: "2021-10-01T00:00:00.000Z",
        updatedAt: "2021-10-01T00:00:00.000Z",
        reactions: [],
        Tags: [],
        id: "article-base64-name-of-article",
        title: "The Future of Artificial Intelligence",
        description: "Exploring the latest developments in AI and their impact on society",
        content: "Artificial Intelligence continues to evolve at an unprecedented pace, transforming industries and reshaping our daily lives. From autonomous vehicles to healthcare diagnostics, AI's influence grows more profound with each passing day...",
        miniatureUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995"

    },
    {
        authorName: "John Doe",
        createdAt: "2021-10-01T00:00:00.000Z",
        updatedAt: "2021-10-01T00:00:00.000Z",
        reactions: [],
        Tags: [],
        id: "2",
        title: "Sustainable Living in Modern Cities",
        description: "How urban communities are adapting to environmental challenges",
        content: "As cities grow and evolve, the need for sustainable solutions becomes increasingly urgent. Modern urban planners are implementing innovative approaches to reduce carbon footprints while maintaining quality of life...",
        miniatureUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742"

    },
    {
        authorName: "John Doe",
        createdAt: "2021-10-01T00:00:00.000Z",
        updatedAt: "2021-10-01T00:00:00.000Z",
        reactions: [],
        Tags: [],
        id: "3",
        title: "The Rise of Remote Work",
        description: "Examining the permanent shift in workplace dynamics",
        content: "The global pandemic has accelerated the adoption of remote work, leading to fundamental changes in how we approach productivity, collaboration, and work-life balance...",
        miniatureUrl: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a"

    }
];