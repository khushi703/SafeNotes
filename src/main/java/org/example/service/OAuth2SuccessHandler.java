package org.example.service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.entities.User;
import org.example.repository.UserRepository;
import org.example.utils.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;  // ✅ Inject EmailService

    public OAuth2SuccessHandler(UserRepository userRepository, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;  // ✅ Initialize EmailService
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // Extract user attributes from OAuth2 authentication
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.getOrDefault("name", "Unknown User");

        // If email is null, redirect to failure page
        if (email == null) {
            response.sendRedirect("http://localhost:63342/oauth-failure.html"); // Change if needed
            return;
        }

        // Check if user exists, otherwise create new user
        Optional<User> existingUser = userRepository.findByEmail(email);
        boolean isNewUser = existingUser.isEmpty(); // ✅ Check if it's a new user

        User user = existingUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name);
            newUser.setPassword(""); // No password for OAuth users
            return userRepository.save(newUser);
        });

        // ✅ Send welcome email if new user
        if (isNewUser) {
            emailService.sendWelcomeEmail(email);
        }

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(user.getEmail());

        // ✅ Redirect to frontend with JWT token
        response.sendRedirect("http://localhost:63342/SafeNotes/src/main/webapp/home.html?token=" + jwtToken);

    }
}
