package org.example.controller;

import org.example.service.AuthService;
import org.example.service.UserService;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return new AuthResponse(token);
    }
}
