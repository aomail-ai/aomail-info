import { Article } from "../../../global/types.ts";
import { useAppDispatch, useAppSelector } from "../../../global/redux/hooks.ts";
import { setRecentlyViewedArticles } from "../../../global/redux/articles/actions.ts";
import { saveRecentlyViewedArticles } from "../../../global/redux/localStorage.ts";
import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const recentlyViewedArticles = useAppSelector((state) => state.articles.recentlyViewed);

    const readMore = () => {
        dispatch(setRecentlyViewedArticles([article, ...recentlyViewedArticles]));
        saveRecentlyViewedArticles([article, ...recentlyViewedArticles]);
        navigate(`/article/${article.id}`);
    };
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
            <img
                src={article.miniatureUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{article.updatedAt}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <button
                    onClick={readMore}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Read more →
                </button>
            </div>
        </div>
    );
}