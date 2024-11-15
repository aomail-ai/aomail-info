package ai.aomail.info.backend.utils;

import java.util.Date;
import java.util.List;

public class GetArticleIdsRequest {

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

    public String getOrder() {
        return order;
    }

    public String getSort() {
        return sort;
    }

    public String getSearch() {
        return search;
    }

    public boolean getAdvanced() {
        return advanced;
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

    public String getAuthorName() {
        return authorName;
    }

    public List<String> getTags() {
        return tags;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public Integer getMinReactions() {
        return minReactions;
    }

    public Integer getMaxReactions() {
        return maxReactions;
    }
}
