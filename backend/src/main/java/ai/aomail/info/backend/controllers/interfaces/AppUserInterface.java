package ai.aomail.info.backend.controllers.interfaces;

import ai.aomail.info.backend.models.AppUser;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AppUserInterface extends UserDetailsService {
    AppUser findByUsername(String username);
}
