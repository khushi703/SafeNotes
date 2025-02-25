package org.example.service;

import org.example.entities.User;
import org.example.repository.UserRepository;
import org.example.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;  // ✅ Inject EmailService

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsService userDetailsService, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;  // ✅ Initialize EmailService
    }
    @Autowired
    private UserRepository userRepository; // Added to fetch the correct email

    public String login(String username, String password) {
        // Authenticate the user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        // Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails.getUsername());

        // ✅ Fetch the correct email from the database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String userEmail = user.getEmail();
        if (userEmail != null && !userEmail.isEmpty()) {
            // ✅ Send login notification email to the correct email
            emailService.sendLoginNotification(userEmail);
        }

        return token;
    }

    public String generateTokenForOAuth2User(String email) {
        // Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Generate and return a JWT token
        return jwtUtil.generateToken(userDetails.getUsername());
    }
}
