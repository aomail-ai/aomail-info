package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.models.Session;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.repositories.SessionRepository;
import ai.aomail.info.backend.security.SessionHelper;
import ai.aomail.info.backend.utils.UpdateProfileRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/profile")
public class ProfileController {

    private final Logger logger = LoggerFactory.getLogger(ProfileController.class);
    private final SessionRepository sessionRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(SessionRepository sessionRepository, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.sessionRepository = sessionRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> profile(HttpServletRequest httpRequest) {
        try {
            String sessionId = SessionHelper.getSessionIdFromCookie(httpRequest);
            Session session = sessionRepository.findBySessionId(sessionId);
            AppUser appUser = session.getUser();

            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "username", appUser.getUsername(),
                    "name", appUser.getName(),
                    "surname", appUser.getSurname(),
                    "createdAt", appUser.getCreatedAt()
            ));
        } catch (Exception e) {
            logger.error("Error while getting profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }

    @PutMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest, HttpServletRequest httpRequest) {
        logger.debug("Update profile request received");

        try {
            String sessionId = SessionHelper.getSessionIdFromCookie(httpRequest);
            Session session = sessionRepository.findBySessionId(sessionId);
            AppUser appUser = session.getUser();

            String name = updateProfileRequest.getName();
            String surname = updateProfileRequest.getSurname();
            String username = updateProfileRequest.getUsername();
            String currentPassword = updateProfileRequest.getCurrentPassword();
            String newPassword = updateProfileRequest.getNewPassword();

            if (!appUser.getPassword().equals(passwordEncoder.encode(currentPassword))) {
                if (!name.isEmpty()) {
                    appUser.setName(name);
                }
                if (!surname.isEmpty()) {
                    appUser.setSurname(surname);
                }
                if (!username.isEmpty()) {
                    appUser.setUsername(username);
                }
                if (!newPassword.isEmpty()) {
                    appUser.setPassword(newPassword);
                }
            } else {
                logger.debug("Update profile request refused due to incorrect current password");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Current password is incorrect"));
            }

            appUserRepository.save(appUser);
            sessionRepository.delete(session);

            logger.info("Profile updated successfully for user: {}", appUser.getUsername());

            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "username", appUser.getUsername(),
                    "name", appUser.getName(),
                    "surname", appUser.getSurname(),
                    "createdAt", appUser.getCreatedAt()
            ));
        } catch (Exception e) {
            logger.error("Error while updating profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }

    @DeleteMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> deleteProfile(@RequestBody UpdateProfileRequest updateProfileRequest, HttpServletRequest httpRequest) {
        logger.debug("Delete profile request received");

        try {
            String sessionId = SessionHelper.getSessionIdFromCookie(httpRequest);
            Session session = sessionRepository.findBySessionId(sessionId);
            AppUser appUser = session.getUser();
            String currentPassword = updateProfileRequest.getCurrentPassword();

            if (!appUser.getPassword().equals(passwordEncoder.encode(currentPassword))) {
                logger.debug("Delete profile request refused due to incorrect current password");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Current password is incorrect"));
            }

            sessionRepository.delete(session);
            appUserRepository.delete(appUser);

            logger.info("Profile deleted successfully for user: {}", appUser.getUsername());

            return ResponseEntity.status(HttpStatus.OK).body("Profile deleted successfully");
        } catch (Exception e) {
            logger.error("Error while deleting profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }
}
