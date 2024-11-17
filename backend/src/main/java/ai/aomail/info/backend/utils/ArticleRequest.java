package ai.aomail.info.backend.utils;

import lombok.Getter;

import java.util.List;

@Getter
public class ArticleRequest {
    private int id;
    private List<Integer> ids;
    private String title;
    private String description;
    private String content;
    private List<String> tags;
    private String miniatureUrl;
}
