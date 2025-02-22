package org.example.repository;
import org.example.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRepository extends JpaRepository<Collaboration, Long> {
    List<Collaboration> findByNoteId(Long noteId);  // Ensure this method exists
}
