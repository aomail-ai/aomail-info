package ai.aomail.info.backend.config;

import ai.aomail.info.backend.models.AppUser;
import ai.aomail.info.backend.repositories.AppUserRepository;
import ai.aomail.info.backend.security.SessionFilter;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

@Configuration
public class SecurityConfig {
    private final Logger logger = LoggerFactory.getLogger(SecurityConfig.class.getName());
    private final AppUserRepository appUserRepository;
    private final SessionFilter sessionFilter;
    @Value("${DEFAULT_ADMIN_USERNAME}")
    private String defaultAdminUsername;
    @Value("${DEFAULT_ADMIN_PASSWORD}")
    private String defaultAdminPassword;

    public SecurityConfig(AppUserRepository appUserRepository, @Lazy SessionFilter sessionFilter) {
        this.appUserRepository = appUserRepository;
        this.sessionFilter = sessionFilter;
    }


    // Create user if it doesn't exist on startup
    @PostConstruct
    public void createDefaultAdmin() {
        if (appUserRepository.findByUsername(defaultAdminUsername) == null) {
            AppUser admin = new AppUser();
            admin.setUsername(defaultAdminUsername);
            admin.setPassword(passwordEncoder().encode(defaultAdminPassword));
            admin.setAdministrator(true);
            admin.setSurname("Admin");
            admin.setName("Admin");
            appUserRepository.save(admin);
            logger.info("Default admin {} created.", defaultAdminUsername);
        } else {
            logger.info("Admin {} already exists.", defaultAdminUsername);
        }
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000", "https://info.aomail.ai")); // Frontend origin
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
                        .ignoringRequestMatchers("/api/is-username-available")
                        .ignoringRequestMatchers("/api/signup")
                        .ignoringRequestMatchers("/api/login")
                        .ignoringRequestMatchers("/api/sitemap.xml")
                        .ignoringRequestMatchers("/api/miniature-data/**")
                        .ignoringRequestMatchers("/api/articles-ids")
                        .ignoringRequestMatchers("/api/articles-data")
                        .ignoringRequestMatchers("/api/user/**"))
                .authorizeHttpRequests(authorization -> authorization
                        .requestMatchers("/api/signup").hasAuthority("ADMIN")
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/sitemap.xml").permitAll()
                        .requestMatchers("/api/is-username-available").permitAll()
                        .requestMatchers("/api/miniature-data/**").permitAll()
                        .requestMatchers("/api/articles-ids").permitAll()
                        .requestMatchers("/api/articles-data").permitAll()
                        .requestMatchers("/api/user/**").hasAuthority("USER")
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(sessionFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}