package ai.aomail.info.backend.security;

import ai.aomail.info.backend.models.Session;
import ai.aomail.info.backend.repositories.SessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class SessionFilter extends OncePerRequestFilter {
    private final SessionRepository sessionRepository;
    private final Logger logger = LoggerFactory.getLogger(SessionFilter.class);

    public SessionFilter(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {
        logger.debug("SessionFilter: Starting session validation");

        String sessionId = SessionHelper.getSessionIdFromCookie(request);

        if (sessionId != null) {
            logger.debug("SessionFilter: Found sessionId in cookie: {}", sessionId);
            Session session = sessionRepository.findBySessionId(sessionId);

            if (session != null && session.getExpiryDate().after(new Date())) {
                logger.debug("SessionFilter: Valid session found for user: {}", session.getUser().getUsername());

                // Determine authorities for the user
                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(() -> "USER");

                if (session.getUser().isAdministrator()) {
                    authorities.add(() -> "ADMIN");
                }

                // Create an authentication token and set it in the SecurityContext
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        session.getUser(), null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } else {
                logger.warn("SessionFilter: Invalid or expired session for sessionId: {}", sessionId);
            }
        } else {
            logger.debug("SessionFilter: No sessionId found in cookies");
        }

        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }
}
