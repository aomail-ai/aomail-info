package ai.aomail.info.backend.utils;

import ai.aomail.info.backend.models.Reaction;
import ai.aomail.info.backend.models.Tag;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;


@Getter
@Setter
public class ArticleDataResponse {
    private final Integer id;
    private final String title;
    private final String description;
    private final String content;
    private final String miniatureUrl;
    private final String authorName;
    private final Date createdAt;
    private final Date updatedAt;
    private final List<Reaction> reactions;
    private final List<Tag> tags;


    public ArticleDataResponse(
            Integer id,
            String title,
            String description,
            String content,
            String miniatureUrl,
            String authorName,
            Date createdAt,
            Date updatedAt,
            List<Reaction> reactions,
            List<Tag> tags
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.miniatureUrl = miniatureUrl;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.reactions = reactions;
        this.tags = tags;
    }
}
