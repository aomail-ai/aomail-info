package ai.aomail.info.backend.controllers;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.security.JWTHelper;
import ai.aomail.info.backend.security.JWTRequest;
import ai.aomail.info.backend.security.JWTResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class LoginRestController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JWTHelper helper;

    @Autowired
    @Qualifier("appUserService")
    private AppUserService appUserService;

    private final Logger logger = LoggerFactory.getLogger(LoginRestController.class);

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<JWTResponse> login(@RequestBody JWTRequest request, HttpServletRequest httpRequest) {
        logger.info("Login request received for user: {}", request.getUsername());

        manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        AppUser appUser = appUserService.findByUsername(request.getUsername());
        String issuer = httpRequest.getRequestURL().toString();
        String token = JWTHelper.generateToken(appUser, issuer);
        String refreshToken = JWTHelper.generateRefreshToken(appUser, issuer);

        JWTResponse response = new JWTResponse(token, refreshToken);
        logger.info("Login successful for user: {}", request.getUsername());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

