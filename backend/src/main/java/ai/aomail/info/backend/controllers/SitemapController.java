package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.Article;
import ai.aomail.info.backend.repositories.ArticleRepository;
import com.github.slugify.Slugify;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SitemapController {
    private final ArticleRepository articleRepository;

    @Value("${DEFAULT_BASE_URL}")
    private String defaultBaseUrl;

    public SitemapController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @GetMapping(value = "/api/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String generateSitemap() {
        List<Article> articles = articleRepository.findAll();

        StringBuilder sitemap = new StringBuilder();
        sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        for (Article article : articles) {
            sitemap.append("<url>");
            sitemap.append("<loc>").append(defaultBaseUrl).append("article/")
                    .append(article.getId()).append("/").append(getSlug(article.getTitle())).append("</loc>");
            sitemap.append("<lastmod>").append(article.getUpdatedAt().toString().split(" ")[0]).append("</lastmod>");
            sitemap.append("</url>");
        }

        sitemap.append("</urlset>");
        return sitemap.toString();
    }

    public String getSlug(String title) {
        return Slugify.builder().build().slugify(title);
    }
}

