package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.models.Session;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.repositories.SessionRepository;
import ai.aomail.info.backend.security.LoginRequest;
import ai.aomail.info.backend.security.SessionHelper;
import ai.aomail.info.backend.security.SignupRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class AuthenticationRestController {
    private final Logger logger = LoggerFactory.getLogger(AuthenticationRestController.class);

    private final AuthenticationManager manager;
    private final AppUserService appUserService;
    private final AppUserRepository appUserRepository;
    private final SessionRepository sessionRepository;

    public AuthenticationRestController(AuthenticationManager manager, AppUserService appUserService, AppUserRepository appUserRepository, SessionRepository sessionRepository) {
        this.manager = manager;
        this.appUserService = appUserService;
        this.appUserRepository = appUserRepository;
        this.sessionRepository = sessionRepository;
    }

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
        } while (sessionRepository.findBySessionId(sessionId) != null); // Check if sessionId already exists

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
            Session session = sessionRepository.findByUser(appUser);
            if (session != null) {
                session.setSessionId(sessionId);
                session.setExpiryDate(expiryDate);
                sessionRepository.save(session);
            } else {
                Session newSession = new Session(sessionId, appUser, expiryDate);
                sessionRepository.save(newSession);
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

    @GetMapping(value = "/logout", produces = "application/json")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest) {
        logger.info("Logout request received");
        try {
            String sessionId = SessionHelper.getSessionIdFromCookie(httpRequest);
            Session session = sessionRepository.findBySessionId(sessionId);
            if (session != null) {
                sessionRepository.delete(session);
                logger.info("Session deleted successfully");
            }
            logger.info("Logout successful");
        } catch (Exception e) {
            logger.error("Error while deleting session: {}", e.getMessage());
        }
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @PostMapping(value = "/signup", produces = "application/json")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        logger.info("Signup request received for user: {}", request.getUsername());

        String name = request.getName();
        String password = request.getPassword();
        String surname = request.getSurname();
        String username = request.getUsername();

        if (name == null || password == null || surname == null || username == null) {
            return ResponseEntity.status(400).body(Map.of("message", "All fields are required"));
        }

        try {
            appUserService.findByUsername(username);
            return ResponseEntity.status(400).body(Map.of("message", "Username already exists"));
        } catch (UsernameNotFoundException e) {
            logger.info("Username is available");
        }

        AppUser appUser = new AppUser();
        appUser.setName(name);
        appUser.setPassword(password);
        appUser.setSurname(surname);
        appUser.setUsername(username);
        appUserRepository.save(appUser);

        logger.info("User {} created successfully", username);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("msg", "User created successfully"));
    }
}
