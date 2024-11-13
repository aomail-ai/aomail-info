package ai.aomail.info.backend.controllers.interfaces;

import ai.aomail.info.backend.models.Reaction;

import java.util.List;

public interface ReactionInterface {

    Reaction findReactionById(int id);

    Reaction createReaction(Reaction reaction);

    Reaction updateReaction(Reaction reaction);

    boolean deleteReaction(int id);

    List<Reaction> findReactionsByArticleId(int articleId);
}
