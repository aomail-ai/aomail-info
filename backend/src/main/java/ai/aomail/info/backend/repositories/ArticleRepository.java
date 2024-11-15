package ai.aomail.info.backend.repositories;

import ai.aomail.info.backend.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {
    Article findArticleById(int id);

    List<Article> findArticleByIdIn(Collection<Integer> ids);

    @Query("SELECT a.id FROM Article a")
    List<Integer> findAllArticleIds();
}
