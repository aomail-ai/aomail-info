package ai.aomail.info.backend.models;

import jakarta.persistence.*;


@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;


    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Article getArticle() {
        return article;
    }
}
