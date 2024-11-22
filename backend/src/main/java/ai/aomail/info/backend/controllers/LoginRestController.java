package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.security.JWTHelper;
import ai.aomail.info.backend.security.JWTRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody JWTRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        logger.info("Login request received for user: {}", request.getUsername());

        try {
            logger.debug("Before authentication logic...");
            manager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            logger.debug("Authentication succeeded");
        } catch (Exception e) {
            logger.debug("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        logger.debug("After authentication logic...");


        // Fetch user details
        AppUser appUser = appUserService.findByUsername(request.getUsername());
        String issuer = httpRequest.getRequestURL().toString();

        // Generate tokens
        String token = JWTHelper.generateToken(appUser, issuer);
        String refreshToken = JWTHelper.generateRefreshToken(appUser, issuer);

        // Set tokens as HTTP-only cookies
        int accessTokenExpiry = 15 * 60; // 15 minutes in seconds
        int refreshTokenExpiry = 7 * 24 * 60 * 60; // 7 days in seconds

        Cookie accessTokenCookie = new Cookie("accessToken", token);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true); // Ensure this is sent only over HTTPS
        accessTokenCookie.setPath("/"); // Accessible across the app
        accessTokenCookie.setMaxAge(accessTokenExpiry); // Expiry time

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenExpiry);

        // Add cookies to the response
        httpResponse.addCookie(accessTokenCookie);
        httpResponse.addCookie(refreshTokenCookie);

        // Return a success response
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

