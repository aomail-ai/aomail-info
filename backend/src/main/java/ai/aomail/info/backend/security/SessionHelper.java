package ai.aomail.info.backend.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SessionHelper {
    public static final int SESSION_ID_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

    public static String generateSessionID() {
        return UUID.randomUUID().toString();
    }

    public static String getSessionIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("session".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
