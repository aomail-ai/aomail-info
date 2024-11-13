package ai.aomail.info.backend.models;

import jakarta.persistence.*;

@Entity
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String reaction;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Article article;

    public int getId() {
        return id;
    }

    public String getReaction() {
        return reaction;
    }

    public Article getArticle() {
        return article;
    }
}
