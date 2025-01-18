package ai.aomail.info.backend.utils;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ReactionCounter {
    private String type;
    private int count;

    public ReactionCounter(String type, int count) {
        this.type = type;
        this.count = count;
    }
}
