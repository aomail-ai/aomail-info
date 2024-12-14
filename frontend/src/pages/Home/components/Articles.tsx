import ArticleCard from "./ArticleCard.tsx";
import { useAppSelector } from "../../../global/redux/hooks.ts";

export default function Articles() {
    const articles = useAppSelector((state) => state.articles.articles);

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}