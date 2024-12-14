package ai.aomail.info.backend.utils;

import lombok.Getter;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Getter
public class GetArticleIdsRequest {
    private int userId;
    private String search;
    private String title;
    private String description;
    private String content;
    private String authorName;
    private List<String> tags;
    private Date startDate;
    private Date endDate;
    private Integer minReactions;
    private Integer maxReactions;
    private boolean advanced;
    private String sort;
    private String order;

    public String getSort() {
        return Objects.requireNonNullElse(sort, "updatedAt");
    }

    public String getOrder() {
        return Objects.requireNonNullElse(order, "desc");
    }
}
