package ai.aomail.info.backend.repositories;

import ai.aomail.info.backend.models.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Integer> {

    Reaction findTagById(int id);

    List<Reaction> findReactionsByArticleId(int articleId);
}