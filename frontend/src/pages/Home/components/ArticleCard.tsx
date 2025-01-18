import { Article } from "../../../global/types.ts";
import { useAppDispatch, useAppSelector } from "../../../global/redux/hooks.ts";
import { useNavigate } from "react-router-dom";
import { setRecentlyViewedArticles } from "../../../global/redux/articles/reducer.ts";
import { API_BASE_URL } from "../../../global/constants.ts";
import { formatDate, getSlug } from "../../../global/formatters.ts";

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const recentlyViewedArticles = useAppSelector((state) => state.articles.recentlyViewed);

    const readMore = () => {
        dispatch(setRecentlyViewedArticles([article, ...recentlyViewedArticles]));
        navigate(`/article/${article.id}/${getSlug(article.title)}`);
    };
    return (
        <button
            onClick={readMore}
            className={"w-full max-w-sm"}
        >
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full">

                <img
                    src={`${API_BASE_URL}miniature-data/${article.miniatureFileName}`}
                    alt={article.title}
                    className="w-full h-48 object-cover" />
                <div className="p-6 flex-grow text-left">
                    <p className="text-sm text-gray-500 mb-2">{formatDate(article.updatedAt)}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <p className="text-indigo-600 hover:text-indigo-700 font-medium">Read more →</p>
                </div>
            </div>
        </button>
    );
};