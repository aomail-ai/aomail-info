package ai.aomail.info.backend.controllers.interfaces;

import ai.aomail.info.backend.models.Article;

public interface ArticleInterface {

    Article findArticleById(int id);

    Article createArticle(Article article);

    Article updateArticle(Article article);

    boolean deleteArticle(int id);


    // TODO: Add method to find all article ids by search query
    // TODO: Add method to find all article ids by advanced filters
}
