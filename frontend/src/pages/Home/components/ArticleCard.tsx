
import { Link } from 'react-router-dom';
import { Article } from "../../../global/types.ts";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
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
        <Link 
          to={`/article/${article.id}`}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}