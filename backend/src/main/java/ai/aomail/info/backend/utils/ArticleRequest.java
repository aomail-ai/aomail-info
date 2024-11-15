package ai.aomail.info.backend.utils;

import java.util.List;

public class ArticleRequest {
    private int id;
    private List<Integer> ids;
    private String title;
    private String description;
    private String content;
    private List<String> tags;


    public String getTitle() {
        return title;
    }


    public String getDescription() {
        return description;
    }


    public String getContent() {
        return content;
    }


    public List<String> getTags() {
        return tags;
    }


    public int getId() {
        return this.id;
    }

    public List<Integer> getIds() {
        return this.ids;
    }
}
