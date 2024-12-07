package ai.aomail.info.backend.utils;

import lombok.Getter;

@Getter
public class UpdateProfileRequest {
    private String name;
    private String surname;
    private String username;
    private String currentPassword;
    private String newPassword;
}
