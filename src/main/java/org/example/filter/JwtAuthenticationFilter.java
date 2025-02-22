package org.example.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.utils.JwtUtil;
import org.example.service.CustomUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // Step 2: Check if the header is missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("JWT Token is missing or invalid");
            filterChain.doFilter(request, response); // Continue with the next filter
            return;
        }

        // Step 3: Extract the token from the header (remove "Bearer " prefix)
        String token = authHeader.substring(7);
        logger.info("Extracted JWT Token: " + token);

        // Step 4: Extract the username from the token
        String username = jwtUtil.extractUsername(token);
        logger.info("Extracted username from token: " + username);

        // Step 5: If the username is valid and there's no existing authentication in the context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("Loading user details for username: " + username);

            // Step 6: Load the user details from the database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            logger.info("Loaded user details: " + userDetails.getUsername());

            // Step 7: Validate the token
            if (jwtUtil.validateToken(token, userDetails)) {
                logger.info("Token is valid");

                // Step 8: Create an authentication token
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Step 9: Set additional details (e.g., IP address, session ID)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Step 10: Set the authentication in the SecurityContextHolder
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("Authentication set in SecurityContextHolder");
            } else {
                logger.warn("Token is invalid");
            }
        }

        // Step 11: Continue with the next filter in the chain
        filterChain.doFilter(request, response);
    }
}