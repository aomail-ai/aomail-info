import React, { useEffect, useState } from "react";
import ArticleCard from "./components/ArticleCard.tsx";
import { postData } from "../../global/fetchData.ts"; // Ensure your import is correct
import { useAppDispatch, useAppSelector } from "../../global/redux/hooks.ts"; // Ensure path is correct
import { setArticlesData, setIds } from "../../global/redux/articles/actions.ts";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    // Select articles and ids from the Redux store
    const articles = useAppSelector((state) => state.articles.articles);
    const ids = useAppSelector((state) => state.articles.ids);


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                let result = await postData("articles-ids", {});
                if (!result.success) {
                    setError(result.error as string);
                    return; // Exit early if an error occurs
                }
                const fetchedIds = result.data.ids;

                // Dispatch IDs to the store
                dispatch(setIds(fetchedIds));

                // Fetch article data for the first 25 articles
                result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
                if (!result.success) {
                    setError(result.error as string);
                    return;
                }
                const fetchedArticles = result.data.articles;

                // Dispatch articles to the store
                dispatch(setArticlesData(fetchedArticles));

            } catch (err) {
                setError(err.message || "Failed to fetch articles.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [dispatch]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}
