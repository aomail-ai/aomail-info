package ai.aomail.info.backend.models;

import jakarta.persistence.*;

@Entity
public class Reaction {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String type; // More descriptive name instead of "reaction"

    @ManyToOne(fetch = FetchType.LAZY) // Optimize loading
    @JoinColumn(name = "article_id", nullable = false) // Correct column name
    private Article article;

    public Reaction() {
        // Default constructor for JPA
    }

    public Reaction(String type, Article article) {
        this.type = type;
        this.article = article;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
}
