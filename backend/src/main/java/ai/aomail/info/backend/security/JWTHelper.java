package ai.aomail.info.backend.security;

import ai.aomail.info.backend.controllers.LoginController;
import ai.aomail.info.backend.models.AppUser;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JWTHelper {

    // private static final String SECRET_KEY = Base64.getEncoder().encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
    private static final String SECRET_KEY = "0rJozkmYVM7WubZSYgXWhmlZw695f/K7pzPxsTNcdFI=";

    private static final byte[] DECODED_SECRET_KEY = Base64.getDecoder().decode(SECRET_KEY);

    private static final long ACCESS_TOKEN_EXPIRATION = 10 * 60 * 1000; // 10 minutes
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);


    public static String generateToken(AppUser user, String issuer) {
        return JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .withIssuer(issuer)
                .withClaim("role", user.isAdministrator() ? "ADMIN" : "USER")
                .sign(Algorithm.HMAC256(DECODED_SECRET_KEY)); // consistently use DECODED_SECRET_KEY
    }

    public static String generateRefreshToken(AppUser user, String issuer) {
        return JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .withIssuer(issuer)
                .sign(Algorithm.HMAC256(DECODED_SECRET_KEY)); // consistently use DECODED_SECRET_KEY
    }

    public static String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(DECODED_SECRET_KEY)) // consistently use DECODED_SECRET_KEY
                .build()
                .verify(token)
                .getSubject();
    }

    public static boolean isTokenExpired(String token) {
        Date expiration = JWT.require(Algorithm.HMAC256(DECODED_SECRET_KEY)) // consistently use DECODED_SECRET_KEY
                .build()
                .verify(token)
                .getExpiresAt();
        return expiration.before(new Date());
    }

    public static String extractRoleFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("role", String.class));
    }

    public static <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private static Claims getAllClaimsFromToken(String token) {
        Key signingKey = Keys.hmacShaKeyFor(DECODED_SECRET_KEY); // consistently use DECODED_SECRET_KEY
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring("Bearer ".length());
        }
        return null;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
}