package ai.aomail.info.backend.utils;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.models.Reaction;
import ai.aomail.info.backend.models.Tag;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class ArticleSpecifications {

    public static Specification<Article> filterArticlesWithOr(
            String search, String sort, String order) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String lowerSearch = "%" + search.toLowerCase() + "%";

                // Add search on title
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        lowerSearch
                ));

                // Add search on description
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        lowerSearch
                ));

                // Add search on author name
                Join<Article, AppUser> userJoin = root.join("user", JoinType.LEFT);
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(userJoin.get("name")),
                        lowerSearch
                ));

                // Add search on tags
                Join<Article, Tag> tagJoin = root.join("tags", JoinType.LEFT);
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(tagJoin.get("name")),
                        lowerSearch
                ));
            }

            // Combine all predicates with OR
            Predicate combinedPredicate = criteriaBuilder.or(predicates.toArray(new Predicate[0]));

            assert query != null;
            query.where(combinedPredicate);

            // Add sorting logic
            if (sort != null && !sort.isEmpty()) {
                Expression<Long> sortField;
                switch (sort) {
                    case "updatedAt":
                        sortField = root.get("updatedAt");
                        break;
                    case "numberOfReactions":
                        // Assuming a field or calculation for number of reactions exists
                        Join<Article, Reaction> reactionJoin = root.join("reactions", JoinType.LEFT);
                        query.groupBy(root.get("id")); // Ensure proper grouping for aggregate functions
                        sortField = criteriaBuilder.count(reactionJoin);
                        break;
                    default:
                        sortField = root.get("updatedAt");
                        break;
                }

                // Apply ordering
                if ("desc".equalsIgnoreCase(order)) {
                    query.orderBy(criteriaBuilder.desc(sortField));
                } else {
                    query.orderBy(criteriaBuilder.asc(sortField));
                }
            }

            return query.getRestriction();
        };
    }

    public static Specification<Article> filterArticles(
            String title, String description, String authorName, List<String> tags,
            Date startDate, Date endDate, Integer minReactions, Integer maxReactions,
            String sort, String order) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Add filters
            if (title != null && !title.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                ));
            }

            if (description != null && !description.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        "%" + description.toLowerCase() + "%"
                ));
            }

            if (authorName != null && !authorName.isEmpty()) {
                Join<Article, AppUser> userJoin = root.join("user", JoinType.LEFT);
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(userJoin.get("name")),
                        "%" + authorName.toLowerCase() + "%"
                ));
            }

            if (tags != null && !tags.isEmpty()) {
                Join<Article, Tag> tagJoin = root.join("tags", JoinType.LEFT);
                predicates.add(tagJoin.get("name").in(tags));
            }

            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate));
            }

            if (minReactions != null || maxReactions != null) {
                Join<Article, Reaction> reactionJoin = root.join("reactions", JoinType.LEFT);
                Expression<Long> reactionCount = criteriaBuilder.count(reactionJoin);
                if (minReactions != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(reactionCount, minReactions.longValue()));
                }
                if (maxReactions != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(reactionCount, maxReactions.longValue()));
                }
            }

            // Combine predicates with AND
            Predicate combinedPredicate = criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            assert query != null;
            query.where(combinedPredicate);

            // Add sorting logic
            if (sort != null && !sort.isEmpty()) {
                Expression<?> sortField;
                switch (sort) {
                    case "updatedAt":
                        sortField = root.get("updatedAt");
                        break;
                    case "numberOfReactions":
                        // Ensure the query groups by ID to avoid aggregate issues
                        Join<Article, Reaction> reactionJoin = root.join("reactions", JoinType.LEFT);
                        query.groupBy(root.get("id"));
                        sortField = criteriaBuilder.count(reactionJoin);
                        break;
                    default:
                        sortField = root.get("updatedAt"); // Default sort by updatedAt
                        break;
                }

                // Apply ordering
                if ("desc".equalsIgnoreCase(order)) {
                    query.orderBy(criteriaBuilder.desc(sortField));
                } else {
                    query.orderBy(criteriaBuilder.asc(sortField));
                }
            }

            return query.getRestriction();
        };
    }

    public static Specification<Article> filterArticlesByUserId(int userId, String sort, String order) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(
                    root.get("user").get("id"),
                    userId
            ));

            // Combine predicates with AND
            Predicate combinedPredicate = criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            assert query != null;
            query.where(combinedPredicate);

            // Add sorting logic
            if (sort != null && !sort.isEmpty()) {
                Expression<?> sortField;
                switch (sort) {
                    case "updatedAt":
                        sortField = root.get("updatedAt");
                        break;
                    case "numberOfReactions":
                        // Ensure the query groups by ID to avoid aggregate issues
                        Join<Article, Reaction> reactionJoin = root.join("reactions", JoinType.LEFT);
                        query.groupBy(root.get("id"));
                        sortField = criteriaBuilder.count(reactionJoin);
                        break;
                    default:
                        sortField = root.get("updatedAt"); // Default sort by updatedAt
                        break;
                }

                // Apply ordering
                if ("desc".equalsIgnoreCase(order)) {
                    query.orderBy(criteriaBuilder.desc(sortField));
                } else {
                    query.orderBy(criteriaBuilder.asc(sortField));
                }
            }

            return query.getRestriction();
        };
    }
}
