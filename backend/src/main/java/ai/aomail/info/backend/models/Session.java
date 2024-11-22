package ai.aomail.info.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true)
    private String sessionId;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;

    public Session(String sessionId, AppUser user, Date expiryDate) {
        this.sessionId = sessionId;
        this.user = user;
        this.expiryDate = expiryDate;
    }
}
