package ai.aomail.info.backend.repositories;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.models.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {
    Session findBySessionId(String sessionId);

    Session findByUser(AppUser appUser);
}
