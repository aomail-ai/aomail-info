package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.models.Session;
import ai.aomail.info.backend.repositories.SessionRepository;
import ai.aomail.info.backend.security.LoginRequest;
import ai.aomail.info.backend.security.SessionHelper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class LoginRestController {
    private final Logger logger = LoggerFactory.getLogger(LoginRestController.class);

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    @Qualifier("appUserService")
    private AppUserService appUserService;

    @Autowired
    private SessionRepository refreshTokenRepository;

    @Autowired
    private SessionRepository findSessionRepository;

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse httpResponse) {
        logger.info("Login request received for user: {}", request.getUsername());

        try {
            manager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            logger.debug("Authentication succeeded");
        } catch (Exception e) {
            logger.debug("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        AppUser appUser = appUserService.findByUsername(request.getUsername());

        // Ensure the session ID is unique
        String sessionId;
        do {
            sessionId = SessionHelper.generateSessionID();
        } while (findSessionRepository.findBySessionId(sessionId) != null); // Check if sessionId already exists

        // Create the session cookie
        Cookie sessionCookie = new Cookie("session", sessionId);
        sessionCookie.setHttpOnly(true);
        sessionCookie.setSecure(true);
        sessionCookie.setPath("/");
        sessionCookie.setMaxAge(SessionHelper.SESSION_ID_EXPIRATION);

        // Set session expiry time (7 days from now)
        Date expiryDate = new Date(System.currentTimeMillis() + (SessionHelper.SESSION_ID_EXPIRATION * 1000));  // milliseconds

        // Save session in the database
        try {
            Session session = findSessionRepository.findByUser(appUser);
            if (session != null) {
                session.setSessionId(sessionId);
                session.setExpiryDate(expiryDate);
                refreshTokenRepository.save(session);
            } else {
                Session newSession = new Session(sessionId, appUser, expiryDate);
                refreshTokenRepository.save(newSession);
            }
        } catch (Exception e) {
            logger.error("Error while updating session: {}", e.getMessage());
        }

        // Add session cookie to the response
        httpResponse.addCookie(sessionCookie);

        logger.info("Login successful for user: {}", request.getUsername());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "username", appUser.getUsername(),
                "name", appUser.getName(),
                "surname", appUser.getSurname(),
                "createdAt", appUser.getCreatedAt(),
                "id", appUser.getId()
        ));
    }
}
