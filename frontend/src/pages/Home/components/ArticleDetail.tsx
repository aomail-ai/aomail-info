import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../global/redux/hooks";
import { selectAllArticles } from "../../../global/redux/articles/selectors";
import DOMPurify from "dompurify";
import { postData } from "../../../global/fetchData";
import { Article } from "../../../global/types";
import { API_BASE_URL } from "../../../global/constants.ts";
import { formatDate } from "../../../global/formatters.ts";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const articles = useAppSelector(selectAllArticles);
    const [article, setArticle] = useState<Article | null>(null);

    const fetchData = async () => {
        try {
            const foundArticle = articles.find((art) => art.id === Number(id));
            if (foundArticle) {
                setArticle(foundArticle);
            } else {
                const result = await postData("articles-data", { ids: [id] });
                if (result.success) {
                    setArticle(result.data.articles[0]);
                } else {
                    navigate("/not-found");
                }
            }
        } catch (error) {
            console.error("Failed to fetch article:", error);
            navigate("/not-found");
        }
    };


    useEffect(() => {
        // increase the view count
        void postData("articles-data/meta-data", { id: id });

        if (id) void fetchData();
    }, [id, articles, navigate]);

    if (!article) {
        return <div>Loading...</div>;
    }

    const sanitizedContent = DOMPurify.sanitize(article.content);

    const handleReaction = async (reaction: string) => {
        const result = await postData("articles-data/meta-data", { reaction: reaction, id: id });
        console.log(result.success);
        if (result.success) {
            const result = await postData("articles-data", { ids: [id] });
            if (result.success) {
                setArticle(result.data.articles[0]);
            }
        }
    };

    function renderReaction(reaction: string) {
        switch (reaction) {
            case "nice":
                return "🤩";
            case "good":
                return "😊";
            case "bof":
                return "😐";
            case "bad":
                return "😕";
            case "terrible":
                return "😡";
        }
    }


    return (
        <div className="py-12 bg-gray-50">
            <article className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <img
                    src={`${API_BASE_URL}miniature-data/${article.miniatureFileName}`}
                    alt={article.title}
                    className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg mb-8"
                />
                <div
                    className="prose prose-lg sm:prose-sm lg:prose-lg max-w-[800px] mx-auto"
                    style={{
                        maxWidth: "800px",
                        wordWrap: "break-word"
                    }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                    <div className="text-gray-500 mb-8">
                        <span>Author: {article.authorSurname} {article.authorName}</span>
                        <br />
                        <span>Created on: {formatDate(article.createdAt)}</span>
                        {article.updatedAt && (
                            <>
                                <br />
                                <span>Updated on: {formatDate(article.updatedAt)}</span>
                            </>
                        )}
                        <div className={"mt-2 flex items-center gap-2"}>
                            <EyeIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span>{article.viewCount}</span>
                        </div>
                    </div>
                    <p className="text-xl text-gray-600 mb-8 font-medium">{article.description}</p>
                    <div
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    ></div>
                    <hr className={"m-5"} />
                    <div className="flex justify-center gap-4 mt-4">
                        {article.reactionCounterList.map(reaction => (
                            <Tooltip key={reaction.type}
                                     title={reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1)} arrow>
                                <Button onClick={() => handleReaction(reaction.type)}
                                        className="rounded-md border-solid border-2 p-4 bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                                    <p className="text-2xl">{renderReaction(reaction.type)}</p>
                                    <p>{reaction.count}</p>
                                </Button>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}
