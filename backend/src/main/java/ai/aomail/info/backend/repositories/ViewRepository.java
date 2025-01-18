package ai.aomail.info.backend.repositories;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.models.View;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewRepository extends JpaRepository<View, Integer> {
    View findViewByArticleAndIpAddress(Article article, String ipAddress);
}
