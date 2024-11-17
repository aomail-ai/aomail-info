import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { articles } from "../../../global/constants.ts";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();



  const article = articles.find((article) => article.id === id);


  useEffect(() => {
    if (!article) {
      navigate('/not-found');
    }
  }, [article, navigate]);

  if (!article) return null;

  return (
    <div className="py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <img 
          src={article.miniatureUrl}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
        />
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-gray-500 mb-8">{article.updatedAt}</p>
          <p className="text-xl text-gray-600 mb-8 font-medium">{article.description}</p>
          <div className="text-gray-800 leading-relaxed">
            {article.content}
          </div>
        </div>
      </article>
    </div>
  );
}