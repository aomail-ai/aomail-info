package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.models.Tag;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.repositories.TagRepository;
import ai.aomail.info.backend.security.JWTHelper;
import ai.aomail.info.backend.utils.ArticleRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ArticleRestController {
    private final Logger logger = LoggerFactory.getLogger(ArticleRestController.class);
    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;

    @Autowired
    @Qualifier("appUserService")
    private AppUserService appUserService;

    public ArticleRestController(ArticleRepository articleRepository, TagRepository tagRepository) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
    }

    @RequestMapping(value = "/user/article", produces = "application/json")
    public ResponseEntity<?> handleRequest(@RequestBody ArticleRequest articleRequest, HttpServletRequest httpRequest) {
        String method = httpRequest.getMethod();
        String token = extractToken(httpRequest);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        String username = JWTHelper.extractUsername(token);
        logger.info("Received {} request from user: {}", method, username);

        return switch (method) {
            case "POST" -> postArticle(articleRequest, username);
            case "PUT" -> updateArticle(articleRequest, username);
            case "DELETE" -> deleteArticles(articleRequest, username);
            default -> ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(Map.of("error", "Method not allowed"));
        };
    }

    private String extractToken(HttpServletRequest httpRequest) {
        String requestHeader = httpRequest.getHeader("Authorization");
        return (requestHeader != null && requestHeader.startsWith("Bearer "))
                ? requestHeader.substring("Bearer ".length())
                : null;
    }

    public ResponseEntity<?> postArticle(ArticleRequest articleRequest, String username) {
        try {
            logger.info("Processing POST request for user: {}", username);

            String content = articleRequest.getContent();
            String title = articleRequest.getTitle();
            String description = articleRequest.getDescription();
            String miniatureUrl = articleRequest.getMiniatureUrl();

            if (content == null || title == null || description == null || miniatureUrl == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        Map.of("error", "Title, content, description and miniature URL are required")
                );
            }

            Article article = new Article(
                    title,
                    description,
                    content,
                    miniatureUrl,
                    appUserService.findByUsername(username)
            );
            articleRepository.save(article);

            List<String> tagNames = articleRequest.getTags();
            List<Tag> tags = new ArrayList<>();
            for (String tagName : tagNames) {
                tagName = tagName.trim();
                if (!tagName.isEmpty()) {
                    Tag tag = tagRepository.findTagByName(tagName);
                    if (tag == null) {
                        tag = new Tag(tagName, article);
                        tagRepository.save(tag);
                    }
                    tags.add(tag);
                }
            }

            article.setTags(tags);
            articleRepository.save(article);

            logger.info("Article posted successfully by user: {}", username);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("msg", "Article posted successfully"));
        } catch (Exception e) {
            logger.error("Error while posting an article", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error while posting the article"));
        }
    }

    private ResponseEntity<?> updateArticle(ArticleRequest articleRequest, String username) {
        try {
            logger.info("Processing PUT request for user: {}", username);

            int id = articleRequest.getId();
            Article article = articleRepository.findArticleById(id);
            if (article == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Article not found"));
            }

            String content = articleRequest.getContent();
            String title = articleRequest.getTitle();
            String description = articleRequest.getDescription();

            if (title != null) article.setTitle(title);
            if (description != null) article.setDescription(description);
            if (content != null) article.setContent(content);

            articleRepository.save(article);
            logger.info("Article with ID {} updated successfully by user: {}", id, username);

            return ResponseEntity.ok(Map.of("msg", "Article updated successfully"));
        } catch (Exception e) {
            logger.error("Error while updating the article", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error while updating the article"));
        }
    }

    private ResponseEntity<?> deleteArticles(ArticleRequest articleRequest, String username) {
        try {
            logger.info("Processing DELETE request for user: {}", username);

            List<Integer> ids = articleRequest.getIds();
            for (int id : ids) {
                Article article = articleRepository.findArticleById(id);
                if (article != null) {
                    articleRepository.delete(article);
                    logger.info("Deleted article with ID {} by user: {}", id, username);
                } else {
                    logger.warn("Article with ID {} not found. Skipping deletion.", id);
                }
            }

            return ResponseEntity.ok(Map.of("msg", "Articles deleted successfully"));
        } catch (Exception e) {
            logger.error("Error while deleting articles", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error while deleting articles"));
        }
    }
}
