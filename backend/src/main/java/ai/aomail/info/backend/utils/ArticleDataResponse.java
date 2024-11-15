package ai.aomail.info.backend.utils;

import java.util.Date;

public class ArticleDataResponse {
    private final Integer id;
    private final String title;
    private final String description;
    private final String content;
    private final String author;
    private final Date createdAt;
    private final Date updatedAt;

    public ArticleDataResponse(
            Integer id,
            String title,
            String description,
            String content,
            String author,
            Date createdAt,
            Date updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getContent() {
        return content;
    }

    public String getAuthor() {
        return author;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
}
