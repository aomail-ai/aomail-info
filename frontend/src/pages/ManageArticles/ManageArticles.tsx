import React, { useEffect, useRef, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { setArticlesData, setIds } from "../../global/redux/articles/actions.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import { useAppDispatch, useAppSelector } from "../../global/redux/hooks.ts";
import { loadUserState } from "../../global/localStorage.ts";
import { selectFetchIds } from "../../global/redux/articles/selectors.ts";
import { Article } from "../../global/types.ts";

const ManageArticles = () => {
    // todo: add modals (as components) to update and delete articles + a preview modal + prompt to confirm deletion/edition
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<number>(0);
    const userState = loadUserState();
    const fetchedIds = useAppSelector(selectFetchIds);
    const dispatch = useAppDispatch();

    const displayPopup = (type: "success" | "error", title: string, message: string) => {
        if (type === "error") {
            displayErrorPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        } else {
            displaySuccessPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        }
        timerId.current = setTimeout(() => {
            setShowNotification(false);
        }, 4000);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            let result = await postData("articles-ids", { userId: userState?.id });
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            const fetchedIds = result.data.ids;
            dispatch(setIds(fetchedIds));

            result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            setArticles(result.data.articles);
            dispatch(setArticlesData(result.data.articles));
            setLoading(false);
        };
        fetchArticles();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl text-gray-700">Loading...</div>;
    }

    return (
        <>
            <NotificationTimer
                showNotification={showNotification}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                backgroundColor={backgroundColor}
                onDismiss={() => setShowNotification(false)}
            />
            <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{article.title}</h2>
                                    <p className="text-gray-600 text-sm mt-2">
                                        {article.description}
                                    </p>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        className="px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        className="px-3 py-1 text-sm text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {fetchedIds.length > articles.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                onClick={() => {
                                    // Logic to load more articles
                                    const nextBatch = fetchedIds.slice(articles.length, articles.length + 25);
                                    postData("articles-data", { ids: nextBatch }).then((result) => {
                                        if (result.success) {
                                            setArticles([...articles, ...result.data.articles]);
                                        } else {
                                            displayPopup("error", "Failed to load more articles", result.error as string);
                                        }
                                    });
                                }}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageArticles;
