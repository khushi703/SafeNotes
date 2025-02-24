package org.example.service;

import org.example.entities.Collaboration;
import org.example.entities.Note;
import org.example.entities.User;
import org.example.repository.CollaborationRepository;
import org.example.repository.NoteRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollaborationService {
    @Autowired
    private CollaborationRepository collaborationRepository;
    @Autowired
    private UserRepository userRepository;  // Ensure UserRepository exists
    @Autowired
    private NoteRepository noteRepository;  // Ensure NoteRepository exists

    public Collaboration addCollaboration(Collaboration collaboration) {
        // Fetch existing Note
        Note note = noteRepository.findById(collaboration.getNote().getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Fetch existing User
        User user = userRepository.findById(collaboration.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set the fetched objects (avoiding transient instance issues)
        collaboration.setNote(note);
        collaboration.setUser(user);

        return collaborationRepository.save(collaboration);
    }

    public List<Collaboration> getCollaboratorsByNote(Long noteId) {
        return collaborationRepository.findByNoteId(noteId);
    }

    public List<Collaboration> getCollaboratorsByFolder(Long folderId) {
        return collaborationRepository.findByFolderId(folderId); // New method for folder collaborations
    }

    public void removeCollaboration(Long collaborationId) {
        collaborationRepository.deleteById(collaborationId);
    }

    public Collaboration acceptCollaboration(Long collaborationId) {
        Collaboration collaboration = collaborationRepository.findById(collaborationId).orElseThrow();
        collaboration.setStatus(Collaboration.CollaborationStatus.ACCEPTED);
        return collaborationRepository.save(collaboration);
    }

    public Collaboration rejectCollaboration(Long collaborationId) {
        Collaboration collaboration = collaborationRepository.findById(collaborationId).orElseThrow();
        collaboration.setStatus(Collaboration.CollaborationStatus.REJECTED);
        return collaborationRepository.save(collaboration);
    }

    public boolean hasFolderPermission(Long userId, Long folderId, Collaboration.CollaborationRole role) {
        return collaborationRepository.findByUserIdAndFolderId(userId, folderId)
                .stream()
                .anyMatch(c -> c.getStatus() == Collaboration.CollaborationStatus.ACCEPTED && c.getRole() == role);
    }
}