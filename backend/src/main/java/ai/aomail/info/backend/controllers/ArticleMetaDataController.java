package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.models.Reaction;
import ai.aomail.info.backend.models.View;
import ai.aomail.info.backend.repositories.ArticleRepository;
import ai.aomail.info.backend.repositories.ReactionRepository;
import ai.aomail.info.backend.repositories.ViewRepository;
import ai.aomail.info.backend.utils.UpdateArticleMetaDataRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles-data/meta-data")
public class ArticleMetaDataController {
    private final Logger logger = LoggerFactory.getLogger(ArticleMetaDataController.class);
    private final ArticleRepository articleRepository;
    private final ViewRepository viewRepository;
    private final ReactionRepository reactionRepository;

    public ArticleMetaDataController(ArticleRepository articleRepository, ViewRepository viewRepository, ReactionRepository reactionRepository) {
        this.articleRepository = articleRepository;
        this.viewRepository = viewRepository;
        this.reactionRepository = reactionRepository;
    }

    private static int getReactionIndex(String reaction) {
        switch (reaction) {
            case "nice" -> {
                return 1;
            }
            case "good" -> {
                return 2;
            }
            case "bof" -> {
                return 3;
            }
            case "bad" -> {
                return 4;
            }
            default -> {
                return 5;
            }
        }
    }

    @Transactional
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateMetaData(@RequestBody UpdateArticleMetaDataRequest updateArticleMetaDataRequest, HttpServletRequest httpRequest) {
        logger.debug("POST: Received article metadata update request");

        String reaction = updateArticleMetaDataRequest.getReaction();
        String id = updateArticleMetaDataRequest.getId();
        String ipAddress = httpRequest.getRemoteAddr();

        logger.debug("Received article metadata update request for article with id: {}", id);
        logger.debug("Received article metadata update request for article with reaction: {}", reaction);

        Article article = articleRepository.findById(Integer.parseInt(id)).orElse(null);

        if (article == null) {
            logger.error("Article with id {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Article not found"));
        } else if (reaction != null && !reaction.isEmpty()) {
            if (!(reaction.equals("nice") || reaction.equals("good") || reaction.equals("bof") || reaction.equals("bad") || reaction.equals("terrible"))) {
                logger.error("Invalid reaction {}", reaction);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid reaction"));
            } else {
                List<Reaction> reactionList = reactionRepository.findReactionsByArticleIdAndIpAddress(article.getId(), ipAddress);

                if (!reactionList.isEmpty()) {
                    Reaction reactionObj = reactionList.getFirst();
                    if (reactionObj.getIndex() == getReactionIndex(reaction)) {
                        logger.debug("User wants to delete reaction");
                        reactionRepository.delete(reactionObj);

                        return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article reaction deleted successfully"));
                    } else {
                        logger.debug("User wants to update reaction");
                        reactionObj.setIndex(getReactionIndex(reaction));
                        reactionRepository.save(reactionObj);
                        logger.debug("Article reaction updated successfully");

                        return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article reaction updated successfully"));
                    }
                } else {
                    int index = getReactionIndex(reaction);
                    Reaction reactionObj = new Reaction(index, article, ipAddress);
                    reactionRepository.save(reactionObj);
                    article.getReactions().add(reactionObj);
                    articleRepository.save(article);
                    logger.debug("Article reaction created successfully");

                    return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article reaction created successfully"));
                }
            }
        } else {
            if (viewRepository.findViewByArticleAndIpAddress(article, ipAddress) != null) {
                logger.debug("Article already viewed with ip address {} ", ipAddress);
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article already viewed"));
            } else {
                logger.debug("Received article metadata update request for article with ip address: {}", ipAddress);
                View view = new View(article, ipAddress);
                viewRepository.save(view);
                article.getViews().add(view);
                articleRepository.save(article);
                logger.debug("Article metadata updated successfully");

                return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Article metadata updated successfully"));
            }
        }
    }
}
