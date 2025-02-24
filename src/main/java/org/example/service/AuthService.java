package org.example.service;

import org.example.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Authenticates a user with the provided username and password.
     *
     * @param username The username of the user.
     * @param password The password of the user.
     * @return A JWT token if authentication is successful.
     */
    public String login(String username, String password) {
        // Authenticate the user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        // Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Generate and return a JWT token
        return jwtUtil.generateToken(userDetails.getUsername());
    }

    /**
     * Generates a JWT token for an OAuth2 user.
     *
     * @param email The email of the OAuth2 user.
     * @return A JWT token.
     */
    public String generateTokenForOAuth2User(String email) {
        // Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Generate and return a JWT token
        return jwtUtil.generateToken(userDetails.getUsername());
    }
}