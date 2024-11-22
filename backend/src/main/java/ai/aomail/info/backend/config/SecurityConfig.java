package ai.aomail.info.backend.config;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.security.JWTAuthenticationFilter;
import ai.aomail.info.backend.security.JWTHelper;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.logging.Logger;

@Configuration
public class SecurityConfig {
    private final Logger logger = Logger.getLogger(SecurityConfig.class.getName());
    private final JWTHelper jwtHelper;
    private final AppUserRepository appUserRepository;
    private final JWTAuthenticationFilter filter;


    public SecurityConfig(
            JWTHelper jwtHelper,
            AppUserRepository appUserRepository,
            JWTAuthenticationFilter filter
    ) {
        this.jwtHelper = jwtHelper;
        this.appUserRepository = appUserRepository;
        this.filter = filter;
    }


    // Create user if it doesn't exist on startup
    @PostConstruct
    public void createDefaultUser() {
        String adminUsername = "admin";
        if (appUserRepository.findByUsername(adminUsername) == null) {
            AppUser admin = new AppUser();
            admin.setName("Admin");
            admin.setSurname("Admin");
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
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173")); // Frontend origin
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache pre-flight response for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(corsConfigurationSource())) // Apply the CORS configuration from the CorsConfigurationSource bean
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/login") // Disable CSRF for /api/login
                        .ignoringRequestMatchers("/api/articles-ids")
                        .ignoringRequestMatchers("/api/articles-data")
                        .ignoringRequestMatchers("/api/user/**") // Disable CSRF for /api/user/**
                )
                .authorizeHttpRequests(authorization -> authorization
                        .requestMatchers("/error").permitAll()
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
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}