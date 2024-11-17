package ai.aomail.info.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Article {

    // Getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Setter
    private String title;

    @Setter
    private String description;

    @Lob // Use Lob for large text fields
    @Column(nullable = false) // Ensure content is required
    private String content;

    private String miniatureUrl;

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY to avoid loading unnecessary user data
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Temporal(TemporalType.TIMESTAMP) // Ensures correct mapping of Date/Time
    @Column(nullable = false, updatable = false) // Created at is immutable
    private Date createdAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;


    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reaction> reactions; // Added reactions relationship


    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true) // Handle child entity lifecycle
    private List<Tag> tags;


    public Article(
            String title,
            String description,
            String content,
            String miniatureUrl,
            AppUser user
    ) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.miniatureUrl = miniatureUrl;
        this.user = user;
        this.createdAt = new Date();
    }


    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
}
