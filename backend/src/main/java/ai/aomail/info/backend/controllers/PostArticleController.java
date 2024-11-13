package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.security.JWTHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PostArticleController {

    private final Logger logger = LoggerFactory.getLogger(LoginController.class);
    private final ArticleRepository articleRepository;
    @Autowired
    @Qualifier("appUserController")
    private AppUserController appUserService;

    public PostArticleController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @PostMapping(value = "/user/post-article", produces = "application/json")
    public ResponseEntity<String> postArticle(HttpServletRequest httpRequest) {
        String requestHeader = httpRequest.getHeader("Authorization");
        String token = requestHeader.substring("Bearer ".length());
        String role = JWTHelper.extractRoleFromToken(token);

        logger.info("Post article request received for user: {}", JWTHelper.extractUsername(token));

        if (role.equals("ADMIN")) {
            logger.debug("User is an admin, proceeding to post article");

            String content = httpRequest.getParameter("content");
            String title = httpRequest.getParameter("title");
            String author = JWTHelper.extractUsername(token);
            String description = httpRequest.getParameter("description");

            Article article = new Article(title, description, content, appUserService.findByUsername(author));
            articleRepository.save(article);

            logger.info("Article posted successfully for user: {}", JWTHelper.extractUsername(token));

            return ResponseEntity.status(HttpStatus.CREATED).body("Article posted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to post an article");
        }
    }
}
