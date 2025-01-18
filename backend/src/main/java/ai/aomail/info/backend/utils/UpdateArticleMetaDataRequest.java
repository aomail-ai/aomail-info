package ai.aomail.info.backend.utils;

import lombok.Getter;

@Getter
public class UpdateArticleMetaDataRequest {
    private String id;
    private String reaction;
    private String ipAddress;
}
