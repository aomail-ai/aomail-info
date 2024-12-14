package ai.aomail.info.backend.security;


import lombok.Getter;

@Getter
public class SignupRequest {
    private String username;
    private String password;
    private String name;
    private String surname;
}
