package com.travel.booking.security;

import com.travel.booking.entity.User;
import com.travel.booking.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;
    private final String frontendOAuthSuccessUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserService userService,
            JwtService jwtService,
            @Value("${app.frontend.oauth-success-url}") String frontendOAuthSuccessUrl
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.frontendOAuthSuccessUrl = frontendOAuthSuccessUrl;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userService.findOrCreateOAuthUser(name, email);
        String token = jwtService.generateToken(user);
        String redirectUrl = frontendOAuthSuccessUrl
            + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
            + "&role=" + URLEncoder.encode(user.getRole().name(), StandardCharsets.UTF_8)
            + "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }
}
