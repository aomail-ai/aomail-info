package ai.aomail.info.backend.repositories;

import ai.aomail.info.backend.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    Article findArticleById(int id);


    // 1. Find all article IDs with a string query (OR on title, description, content, author name, tag names)
//    @Query("SELECT a.id FROM Article a " +
//            "LEFT JOIN a.user u " +
//            "LEFT JOIN Tag t ON t.article = a " +
//            "WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
//            "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
//            "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
//            "OR (u IS NOT NULL AND LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
//            "OR (t IS NOT NULL AND LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')))")
//    List<Integer> findAllArticleIdsBySearchQuery(@Param("query") String query);
//
//    // 2. Find all article IDs with advanced filters (AND on title, description, authorName, tag names list, date range, nbReactions range)
//    @Query("SELECT a.id FROM Article a " +
//            "LEFT JOIN a.user u " +
//            "LEFT JOIN Tag t ON t.article = a " +
//            "LEFT JOIN Reaction r ON r.article = a " +
//            "WHERE (:title IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
//            "AND (:description IS NULL OR LOWER(a.description) LIKE LOWER(CONCAT('%', :description, '%'))) " +
//            "AND (:authorName IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :authorName, '%'))) " +
//            "AND (:tags IS NULL OR t.name IN :tags) " +
//            "AND (:startDate IS NULL OR a.createdAt >= :startDate) " +
//            "AND (:endDate IS NULL OR a.createdAt <= :endDate) " +
//            "AND ((:minReactions IS NULL AND :maxReactions IS NULL) OR " +
//            "     (COUNT(r.id) BETWEEN :minReactions AND :maxReactions)) " +
//            "GROUP BY a.id")
//    List<Integer> findAllArticleIdsByAdvancedFilters(
//            @Param("title") String title,
//            @Param("description") String description,
//            @Param("authorName") String authorName,
//            @Param("tags") List<String> tags,
//            @Param("startDate") Date startDate,
//            @Param("endDate") Date endDate,
//            @Param("minReactions") Long minReactions,
//            @Param("maxReactions") Long maxReactions
//    );
}
