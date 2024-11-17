import React, { useEffect, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { useAppDispatch } from "../../global/redux/hooks.ts";
import { setArticlesData, setIds } from "../../global/redux/articles/actions.ts";
import Articles from "./components/Articles.tsx";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                let result = await postData("articles-ids", {});
                if (!result.success) {
                    setError(result.error as string);
                    return;
                }
                const fetchedIds = result.data.ids;
                dispatch(setIds(fetchedIds));


                result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
                if (!result.success) {
                    setError(result.error as string);
                    return;
                }
                dispatch(setArticlesData(result.data.articles));

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
        <Articles />
    );
}
