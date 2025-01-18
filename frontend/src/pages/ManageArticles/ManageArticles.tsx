import { useEffect, useRef, useState } from "react";
import { deleteData, postData } from "../../global/fetchData.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import { useAppDispatch, useAppSelector } from "../../global/redux/hooks.ts";
import { loadUserState } from "../../global/localStorage.ts";
import { selectFetchIds } from "../../global/redux/articles/selectors.ts";
import { Article } from "../../global/types.ts";
import { setArticlesData, setIds } from "../../global/redux/articles/reducer.ts";
import ArticleDeletionConfirmationModal from "./components/ArticleDeletionConfirmationModal.tsx";
import ArticleEditionModal from "./components/ArticleEditionModal.tsx";
import { fetchWithToken } from "../../global/security.ts";
import { API_BASE_URL } from "../../global/constants.ts";
import Quill from "quill";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import { getSlug } from "../../global/formatters.ts";

const ManageArticles = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [miniatureFile, setMiniatureFile] = useState<File | null>(null);
    const editorRef = useRef<Quill | null>(null);
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const userState = loadUserState();
    const fetchedIds = useAppSelector(selectFetchIds);
    const dispatch = useAppDispatch();
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [isArticleDeletionModalOpen, setIsArticleDeletionModalOpen] = useState(false);
    const [isArticleEditionModalOpen, setIsArticleEditionModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const fetchArticles = async () => {
        if (!userState?.id) {
            navigate("/not-authorized");
        }
        let result = await postData("articles-ids", { userId: userState.id });
        if (!result.success) {
            displayPopup("error", "Failed to fetch articles", result.error as string);
            return;
        }
        const fetchedIds = result.data.ids;
        dispatch(setIds(result.data.ids));

        result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
        if (!result.success) {
            displayPopup("error", "Failed to fetch articles", result.error as string);
            return;
        }
        setArticles(result.data.articles);
        dispatch(setArticlesData(result.data.articles));
        setLoading(false);
    };

    useEffect(() => {
        void fetchArticles();
    }, []);


    const openArticleDeletionModal = (articleId: number) => {
        setSelectedArticleId(articleId);
        setIsArticleDeletionModalOpen(true);
    };

    const handleArticleDeletion = async () => {
        const result = await deleteData("user/article", { ids: [selectedArticleId] });
        setIsArticleDeletionModalOpen(false);

        if (!result.success) {
            displayPopup("error", "Failed to delete article", result.error as string);
            return;
        } else {
            displayPopup("success", "Success", "Article deleted successfully");
            void fetchArticles();
        }
    };

    const openArticleEditionModal = (articleId: number) => {
        setSelectedArticleId(articleId);
        setIsArticleEditionModalOpen(true);
        setTitle(articles.find((article) => article.id === articleId)!.title);
        setDescription(articles.find((article) => article.id === articleId)!.description);
        setContent(articles.find((article) => article.id === articleId)!.content);
        setTags(articles.find((article) => article.id === articleId)!.tags.map((tag) => tag.name));
    };

    const handleArticleEdition = async () => {
        const formData = new FormData();
        formData.append("id", selectedArticleId!.toString());
        if (tags) {
            formData.append("tags", JSON.stringify(tags));
        }
        if (title) {
            formData.append("title", title);
        }
        if (description) {
            formData.append("description", description);
        }
        if (content) {
            formData.append("content", content);
        }
        if (miniatureFile) {
            formData.append("miniature", miniatureFile);
        }

        const response = await fetchWithToken(`${API_BASE_URL}user/article`, {
            method: "PUT",
            body: formData as BodyInit
        });

        if (!response) {
            displayPopup("error", "Failed to edit article", "No server response");
            return;
        }

        if (response.ok) {
            displayPopup("success", "Success", "Article edited successfully!");
            setTitle("");
            setDescription("");
            setContent("");
            setTags([]);
            setMiniatureFile(null);
            editorRef.current!.root.innerHTML = "";
            void fetchArticles();
        } else {
            try {
                const data = await response.json();
                displayPopup("error", "Failed to edit article", data.error ? data.error : "Unknown error");
            } catch {
                displayPopup("error", "Failed to edit article", "Unknown error");
            }
        }
    };

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
            <ArticleDeletionConfirmationModal
                isOpen={isArticleDeletionModalOpen}
                onClose={() => setIsArticleDeletionModalOpen(false)}
                onConfirm={() => {
                    void handleArticleDeletion();
                }}
            />
            <ArticleEditionModal
                isOpen={isArticleEditionModalOpen}
                onClose={() => setIsArticleEditionModalOpen(false)}
                onConfirm={() => {
                    void handleArticleEdition();
                }}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                setContent={setContent}
                tags={tags}
                setTags={setTags}
                setMiniatureFile={setMiniatureFile}
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
                                    <div className="flex items-center text-sm text-gray-500 mt-2">
                                        <EyeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span>{article.viewCount}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-2">
                                        {article.description}
                                    </p>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <a href={`/article/${article.id}/${getSlug(article.title)}`} target="_blank"
                                       className="px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
                                    >
                                        Preview
                                    </a>
                                    <button
                                        onClick={() => openArticleEditionModal(article.id)}
                                        className="px-3 py-1 text-sm text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openArticleDeletionModal(article.id)}
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
