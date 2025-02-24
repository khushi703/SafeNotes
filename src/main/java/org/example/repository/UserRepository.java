package org.example.repository;
import org.example.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);  // Ensure Optional<User>
     Optional<User> findByEmail(String email); // New method for Google OAuth2
}
