package ai.aomail.info.backend.config;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.security.SessionFilter;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
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

@Slf4j
@Configuration
public class SecurityConfig {
    private final Logger logger = Logger.getLogger(SecurityConfig.class.getName());
    private final AppUserRepository appUserRepository;
    private final SessionFilter sessionFilter;

    public SecurityConfig(AppUserRepository appUserRepository,
                          @Lazy SessionFilter sessionFilter
    ) {
        this.appUserRepository = appUserRepository;
        this.sessionFilter = sessionFilter;
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
            admin.setPassword(passwordEncoder().encode("password"));
            admin.setAdministrator(true);
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
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000")); // Frontend origin
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(java.util.List.of("Content-Type", "Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache pre-flight response for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/login")
                        .ignoringRequestMatchers("/api/logout")
                        .ignoringRequestMatchers("/api/articles-ids")
                        .ignoringRequestMatchers("/api/articles-data")
                        .ignoringRequestMatchers("/api/user/**")
                )
                .authorizeHttpRequests(authorization -> authorization
                        .requestMatchers("/api/articles-ids").permitAll()
                        .requestMatchers("/api/articles-data").permitAll()
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/user/**").hasAuthority("USER")
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(sessionFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}