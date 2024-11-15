package ai.aomail.info.backend.config;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.security.JWTAuthenticationFilter;
import ai.aomail.info.backend.security.JWTHelper;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.logging.Logger;

@Configuration
public class SecurityConfig {
    private final Logger logger = Logger.getLogger(SecurityConfig.class.getName());
    private final JWTHelper jwtHelper;
    private final UserDetailsService userDetailsService;
    private final AppUserRepository appUserRepository;
    private final JWTAuthenticationFilter filter;


    public SecurityConfig(
            JWTHelper jwtHelper,
            UserDetailsService userDetailsService,
            AppUserRepository appUserRepository,
            JWTAuthenticationFilter filter
    ) {
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
        this.appUserRepository = appUserRepository;
        this.filter = filter;
    }

    // Create user if it doesn't exist on startup
    @PostConstruct
    public void createDefaultUser() {
        String adminUsername = "admin";
        if (appUserRepository.findByUsername(adminUsername) == null) {
            AppUser admin = new AppUser();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder().encode("password")); // Encode the password
            admin.setAdministrator(true); // Set admin role (assuming you have an 'administrator' field)
            appUserRepository.save(admin);
            logger.info("Default admin user created successfully.");
        } else {
            logger.info("Admin user already exists.");
        }
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // TODO: Add CSRF protection for production
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/login") // Disable CSRF for /api/login
                        .ignoringRequestMatchers("/api/articles-ids")
                        .ignoringRequestMatchers("/api/articles-data")
                        .ignoringRequestMatchers("/api/user/**") // Disable CSRF for /api/user/**
                )
                .authorizeHttpRequests(authorization -> authorization
                        .requestMatchers("/api/articles-ids").permitAll()
                        .requestMatchers("/api/articles-data").permitAll()
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/user/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class) // Use the JWT filter
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return appUserRepository.findByUsername("admin") == null ?
                new InMemoryUserDetailsManager() : userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}