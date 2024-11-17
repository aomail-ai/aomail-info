package ai.aomail.info.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false) // Ensure name is required
    private String name;

    @ManyToOne(fetch = FetchType.LAZY) // Optimize loading
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnore
    private Article article;


    public Tag(String name, Article article) {
        this.name = name;
        this.article = article;
    }


}
