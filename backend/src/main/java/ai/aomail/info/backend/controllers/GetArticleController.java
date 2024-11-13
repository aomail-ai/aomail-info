package ai.aomail.info.backend.controllers;


import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.repositories.ReactionRepository;
import ai.aomail.info.backend.repositories.TagRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api")
public class GetArticleController {


    private final Logger logger = LoggerFactory.getLogger(LoginController.class);
    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;

    private final ReactionRepository reactionRepository;
    @Autowired
    @Qualifier("appUserController")
    private AppUserController appUserService;


    public GetArticleController(ArticleRepository articleRepository, TagRepository tagRepository, ReactionRepository reactionRepository) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.reactionRepository = reactionRepository;
    }

    @GetMapping(value = "/user/get-article", produces = "application/json")
    public ResponseEntity<String> postArticle(HttpServletRequest httpRequest) {

        int id = Integer.parseInt(httpRequest.getParameter("id"));

        Article article = articleRepository.findArticleById(id);
        String username = article.getUser().getUsername();
        String content = article.getContent();
        String title = article.getTitle();
        String description = article.getDescription();
        Date createdAt = article.getCreatedAt();
        Date updatedAt = article.getUpdatedAt();


        return ResponseEntity.status(HttpStatus.OK).body("Article retrieved successfully");
    }
}
