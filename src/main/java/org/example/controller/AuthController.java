package org.example.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.example.entities.User;
import org.example.repository.UserRepository;
import org.example.service.AuthService;
import org.example.service.OAuth2SuccessHandler;
import org.example.service.UserService;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.example.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    private final AuthService authService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtUtil jwtUtil;
    public AuthController(AuthService authService, OAuth2SuccessHandler oAuth2SuccessHandler,JwtUtil jwtUtil) {
        this.authService = authService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.jwtUtil = jwtUtil;
    }

    // Existing JWT login endpoint
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return new AuthResponse(token);
    }

    // New endpoint for handling Google OAuth2 login success
    @GetMapping("/google-success")
    public ResponseEntity<AuthResponse> googleSuccess(OAuth2AuthenticationToken authentication) {
        OAuth2User oAuth2User = authentication.getPrincipal();

        String email = (String) oAuth2User.getAttributes().get("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(new AuthResponse(token));
    }

}