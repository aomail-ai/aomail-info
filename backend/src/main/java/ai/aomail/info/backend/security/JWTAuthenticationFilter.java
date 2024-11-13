package ai.aomail.info.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@Component // Ensure Spring manages this as a bean
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(OncePerRequestFilter.class);

    private final JWTHelper jwtHelper;

    // Lazy inject the UserDetailsService to avoid circular dependencies
    private final UserDetailsService userDetailsService;

    @Autowired
    public JWTAuthenticationFilter(JWTHelper jwtHelper, @Lazy UserDetailsService userDetailsService) {
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestHeader = request.getHeader("Authorization");
        logger.info("Header: {}", requestHeader);
        String username = null;
        String token = null;

        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
            token = requestHeader.substring("Bearer ".length());
            try {
                username = this.jwtHelper.getUsernameFromToken(token);
            } catch (IllegalArgumentException e) {
                logger.info("Illegal Argument" +e.getMessage());
                logger.info("Illegal Argument while fetching the username!!");
            } catch (ExpiredJwtException e) {
                logger.info("Given JWT token is expired!!");
            } catch (MalformedJwtException e) {
                logger.info("The token has been modified!! Invalid token");
            } catch (Exception e) {
                logger.error("Error while fetching the username from token: {}", e.getMessage());
            }
        } else {
            logger.info("No Authorization header found!");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch user details from username
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            boolean validateToken = this.jwtHelper.validateToken(token, userDetails);
            if (validateToken) {
                // Set the authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                logger.info("Validation failed!!");
            }
        }

        filterChain.doFilter(request, response); // Continue the filter chain
    }
}
