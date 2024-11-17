package ai.aomail.info.backend.controllers.interfaces;

import ai.aomail.info.backend.models.Article;

public interface ArticleInterface {

    Article findArticleById(int id);

    Article createArticle(Article article);

    Article updateArticle(Article article);

    boolean deleteArticle(int id);
}
