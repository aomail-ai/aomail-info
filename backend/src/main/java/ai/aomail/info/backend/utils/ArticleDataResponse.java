package ai.aomail.info.backend.utils;

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
    private final String miniatureFileName;
    private final String authorName;
    private final String authorSurname;
    private final Date createdAt;
    private final Date updatedAt;
    private final List<ReactionCounter> reactionCounterList;
    private final List<Tag> tags;
    private final int viewCount;


    public ArticleDataResponse(
            Integer id,
            String title,
            String description,
            String content,
            String miniatureFileName,
            String authorName,
            String authorSurname,
            Date createdAt,
            Date updatedAt,
            List<ReactionCounter> reactionCounterList,
            List<Tag> tags,
            int viewCount
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.miniatureFileName = miniatureFileName;
        this.authorName = authorName;
        this.authorSurname = authorSurname;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.reactionCounterList = reactionCounterList;
        this.tags = tags;
        this.viewCount = viewCount;
    }
}
