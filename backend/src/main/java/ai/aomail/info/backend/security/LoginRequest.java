package ai.aomail.info.backend.security;


import lombok.Getter;

@Getter
public class LoginRequest {
    private String username;
    private String password;
}
