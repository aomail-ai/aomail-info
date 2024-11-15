package ai.aomail.info.backend.models;

import jakarta.persistence.*;

@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false) // Ensure name is required
    private String name;

    @ManyToOne(fetch = FetchType.LAZY) // Optimize loading
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    public Tag(String name, Article article) {
        this.name = name;
        this.article = article;
    }

    public Tag() {

    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
}
