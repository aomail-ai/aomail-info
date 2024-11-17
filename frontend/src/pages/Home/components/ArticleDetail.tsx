import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../../global/redux/hooks.ts";
import { selectAllArticles } from "../../../global/redux/articles/selectors.ts";
import DOMPurify from "dompurify";


export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const articles = useAppSelector(selectAllArticles);
    const article = articles.find((article) => article.id === Number(id));

    useEffect(() => {
        if (!article) {
            navigate("/not-found");
        }
    }, [article, navigate]);

    if (!article) return null;


    const sanitizedContent = DOMPurify.sanitize(article.content);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const timeFormat: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric"
        };
        const formatter = new Intl.DateTimeFormat("en-US", timeFormat);
        return formatter.format(date);
    };


    return (
        <div className="py-12">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Image */}
                <img
                    src={article.miniatureUrl}
                    alt={article.title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
                />
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                    <div className="text-gray-500 mb-8">
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
