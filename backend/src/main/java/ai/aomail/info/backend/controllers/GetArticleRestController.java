package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.utils.ArticleDataResponse;
import ai.aomail.info.backend.utils.ArticleRequest;
import ai.aomail.info.backend.utils.ArticleSpecifications;
import ai.aomail.info.backend.utils.GetArticleIdsRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GetArticleRestController {
    private final Logger logger = LoggerFactory.getLogger(GetArticleRestController.class);
    private final ArticleRepository articleRepository;


    public GetArticleRestController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @PostMapping(value = "/articles-ids", produces = "application/json")
    public ResponseEntity<?> getArticleIds(@RequestBody GetArticleIdsRequest getArticleIdsRequest) {
        try {
            boolean advanced = getArticleIdsRequest.getAdvanced();
            String sort = getArticleIdsRequest.getSort();
            String order = getArticleIdsRequest.getOrder();
            List<Integer> ids;

            if (advanced) {
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

                if (search.isEmpty()) {
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
                    .body(Map.of("error", "Error processing request"));
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

            List<ArticleDataResponse> response = articles.stream()
                    .map(article -> new ArticleDataResponse(
                            article.getId(),
                            article.getTitle(),
                            article.getDescription(),
                            article.getContent(),
                            article.getUser().getUsername(),
                            article.getCreatedAt(),
                            article.getUpdatedAt()
                    ))
                    .toList();

            logger.info("Successfully retrieved {} articles", articles.size());
            return ResponseEntity.ok(Map.of("articles", response));
        } catch (Exception e) {
            logger.error("Error processing article data request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing request"));
        }
    }
}

