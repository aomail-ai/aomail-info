import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../global/redux/hooks";
import { selectAllArticles } from "../../../global/redux/articles/selectors";
import DOMPurify from "dompurify";
import { postData } from "../../../global/fetchData";
import { Article } from "../../../global/types";
import { API_BASE_URL } from "../../../global/constants.ts";

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const articles = useAppSelector(selectAllArticles);
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
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

        if (id) void fetchData();
    }, [id, articles, navigate]);

    if (!article) {
        return <div>Loading...</div>;
    }

    const sanitizedContent = DOMPurify.sanitize(article.content);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(date);
    };

    return (
        <div className="py-12">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <img
                    src={`${API_BASE_URL}miniature-data/${article.miniatureFileName}`}
                    alt={article.title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
                />
                <div className="prose prose-lg max-w-none">
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
                    </div>
                    <p className="text-xl text-gray-600 mb-8 font-medium">{article.description}</p>
                    <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    ></div>
                </div>
            </article>
        </div>
    );
}
