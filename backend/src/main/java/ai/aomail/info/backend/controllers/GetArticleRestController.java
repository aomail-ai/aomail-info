package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.repositories.ReactionRepository;
import ai.aomail.info.backend.utils.*;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GetArticleRestController {
    private final Logger logger = LoggerFactory.getLogger(GetArticleRestController.class);
    private final ArticleRepository articleRepository;
    private final ReactionRepository reactionRepository;


    public GetArticleRestController(ArticleRepository articleRepository, ReactionRepository reactionRepository) {
        this.articleRepository = articleRepository;
        this.reactionRepository = reactionRepository;
    }

    @PostMapping(value = "/articles-ids", produces = "application/json")
    public ResponseEntity<?> getArticleIds(@RequestBody GetArticleIdsRequest getArticleIdsRequest) {
        try {
            boolean advanced = getArticleIdsRequest.isAdvanced();
            int userId = getArticleIdsRequest.getUserId();
            String sort = getArticleIdsRequest.getSort();
            String order = getArticleIdsRequest.getOrder();
            List<Integer> ids;

            if (userId != 0) {
                ids = articleRepository.findAll(
                        ArticleSpecifications.filterArticlesByUserId(userId, sort, order)
                ).stream().map(Article::getId).collect(Collectors.toList());
            } else if (advanced) {
                String title = getArticleIdsRequest.getTitle();
                String description = getArticleIdsRequest.getDescription();
                String authorName = getArticleIdsRequest.getAuthorName();
                List<String> tags = getArticleIdsRequest.getTags();
                Date startDate = getArticleIdsRequest.getStartDate();
                Date endDate = getArticleIdsRequest.getEndDate();
                Integer minReactions = getArticleIdsRequest.getMinReactions();
                Integer maxReactions = getArticleIdsRequest.getMaxReactions();


                ids = articleRepository.findAll(
                        ArticleSpecifications.filterArticles(
                                title,
                                description,
                                authorName,
                                tags,
                                startDate,
                                endDate,
                                minReactions,
                                maxReactions,
                                sort,
                                order
                        )
                ).stream().map(Article::getId).collect(Collectors.toList());
            } else {
                String search = getArticleIdsRequest.getSearch();

                if (search == null) {
                    ids = articleRepository.findAllArticleIds();
                } else {
                    ids = articleRepository.findAll(
                                    ArticleSpecifications.filterArticlesWithOr(search, sort, order)
                            ).stream()
                            .map(Article::getId)
                            .collect(Collectors.toList());
                }
            }

            logger.info("Successfully retrieved {} article IDs", ids.size());
            return ResponseEntity.ok(Map.of("ids", ids));
        } catch (Exception e) {
            logger.error("Error processing article IDs request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping(value = "/articles-data", produces = "application/json")
    @Transactional
    public ResponseEntity<?> getArticlesData(@RequestBody ArticleRequest articleRequest) {

        try {
            List<Integer> ids = articleRequest.getIds();
            if (ids == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Article IDs are required"));
            }

            List<Article> articles = articleRepository.findArticleByIdIn(ids);
            List<ArticleDataResponse> response = new ArrayList<>();

            articles.forEach(article -> {
                // Eagerly initialize the reactions and tags to avoid lazy loading issues
                Hibernate.initialize(article.getReactions());
                Hibernate.initialize(article.getTags());

                List<ReactionCounter> reactionCounterList = new ArrayList<>();

                reactionCounterList.add(new ReactionCounter("nice", reactionRepository.findReactionsByIndexAndArticle(1, article).size()));
                reactionCounterList.add(new ReactionCounter("good", reactionRepository.findReactionsByIndexAndArticle(2, article).size()));
                reactionCounterList.add(new ReactionCounter("bof", reactionRepository.findReactionsByIndexAndArticle(3, article).size()));
                reactionCounterList.add(new ReactionCounter("bad", reactionRepository.findReactionsByIndexAndArticle(4, article).size()));
                reactionCounterList.add(new ReactionCounter("terrible", reactionRepository.findReactionsByIndexAndArticle(5, article).size()));

                response.add(new ArticleDataResponse(
                        article.getId(),
                        article.getTitle(),
                        article.getDescription(),
                        article.getContent(),
                        article.getMiniatureFileName(),
                        article.getUser().getName(),
                        article.getUser().getSurname(),
                        article.getCreatedAt(),
                        article.getUpdatedAt(),
                        reactionCounterList,
                        article.getTags(),
                        article.getViews().size()
                ));
            });

            logger.info("Successfully retrieved {} articles", articles.size());
            return ResponseEntity.ok(Map.of("articles", response));
        } catch (Exception e) {
            logger.error("Error processing article data request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }
}

