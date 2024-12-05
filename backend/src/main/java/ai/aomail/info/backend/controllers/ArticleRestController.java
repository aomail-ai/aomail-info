package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.models.Session;
import ai.aomail.info.backend.models.Tag;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.repositories.SessionRepository;
import ai.aomail.info.backend.repositories.TagRepository;
import ai.aomail.info.backend.security.SessionHelper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/user/article")
public class ArticleRestController {
    private final Logger logger = LoggerFactory.getLogger(ArticleRestController.class);
    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;
    private final SessionRepository sessionRepository;
    private final AppUserService appUserService;

    @Autowired
    public ArticleRestController(ArticleRepository articleRepository, TagRepository tagRepository, SessionRepository sessionRepository, AppUserService appUserService) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.sessionRepository = sessionRepository;
        this.appUserService = appUserService;
    }

    @PostMapping(consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<?> createArticle(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("content") String content,
            @RequestParam("tags") String tagsJson,
            @RequestParam("miniature") MultipartFile miniatureFile,
            HttpServletRequest httpRequest
    ) throws IOException {
        logger.debug("POST: Creating an article");

        Session session = validateSession(httpRequest);
        if (session == null) return unauthorizedResponse();

        String username = session.getUser().getUsername();
        validateArticleFields(title, description, content, miniatureFile);

        String uniqueFilename = uploadMiniature(miniatureFile);
        logger.debug("Miniature uploaded with filename: {}", uniqueFilename);

        Article article = new Article(title, description, content, uniqueFilename, appUserService.findByUsername(username));
        articleRepository.save(article);
        logger.debug("Article created and saved");

        List<Tag> tags = processTags(tagsJson, article);
        article.setTags(tags);
        articleRepository.save(article);
        logger.debug("Tags processed and linked to the article");

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("msg", "Article posted successfully"));
    }

    @PutMapping(consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<?> updateArticle(
            @RequestParam("id") int id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("content") String content,
            @RequestParam("tags") String tagsJson,
            @RequestParam("miniature") MultipartFile miniatureFile,
            HttpServletRequest httpRequest
    ) throws IOException {
        logger.debug("PUT: Updating an article with ID {}", id);

        Session session = validateSession(httpRequest);
        if (session == null) return unauthorizedResponse();

        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Article not found"));
        } else if (!article.getUser().equals(session.getUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not authorized to update this article"));
        }

        validateArticleFields(title, description, content, miniatureFile);

        String uniqueFilename = uploadMiniature(miniatureFile);
        logger.debug("Miniature uploaded with filename: {}", uniqueFilename);

        article.setTitle(title);
        article.setDescription(description);
        article.setContent(content);
        article.setMiniatureFileName(uniqueFilename);

        List<Tag> tags = processTags(tagsJson, article);
        article.setTags(tags);
        articleRepository.save(article);

        logger.debug("Article updated successfully with ID {}", id);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article updated successfully"));
    }

    private String uploadMiniature(MultipartFile miniatureFile) throws IOException {
        if (miniatureFile == null || miniatureFile.isEmpty()) {
            throw new IllegalArgumentException("Miniature file is required");
        }

        String originalFilename = miniatureFile.getOriginalFilename();
        String uniqueFilename = System.currentTimeMillis() + "_" + originalFilename;

        Path miniaturePath = Paths.get("backend/src/main/resources/static/miniatureImages/" + uniqueFilename);
        Files.createDirectories(miniaturePath.getParent());
        Files.write(miniaturePath, miniatureFile.getBytes());

        return uniqueFilename;
    }

    private List<Tag> processTags(String tagsJson, Article article) throws IOException {
        List<String> tagNames = new ObjectMapper().readValue(
                tagsJson, new TypeReference<>() {
                });

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

        return tags;
    }

    private Session validateSession(HttpServletRequest httpRequest) {
        String sessionId = SessionHelper.getSessionIdFromCookie(httpRequest);
        return sessionRepository.findBySessionId(sessionId);
    }

    private ResponseEntity<Map<String, String>> unauthorizedResponse() {
        logger.debug("Unauthorized access attempt");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Session not found"));
    }

    private void validateArticleFields(String title, String description, String content, MultipartFile miniatureFile) {
        if (title == null || title.isEmpty() ||
                description == null || description.isEmpty() ||
                content == null || content.isEmpty() ||
                (miniatureFile == null || miniatureFile.isEmpty())) {
            throw new IllegalArgumentException("Title, content, description, and miniature file are required");
        }
    }
}
