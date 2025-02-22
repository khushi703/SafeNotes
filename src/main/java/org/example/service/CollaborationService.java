package org.example.service;
import org.example.entities.Collaboration;
import org.example.repository.CollaborationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollaborationService {
    @Autowired
    private CollaborationRepository collaborationRepository;

    public Collaboration addCollaboration(Collaboration collaboration) {
        return collaborationRepository.save(collaboration);
    }

    public List<Collaboration> getCollaborators(Long noteId) {
        return collaborationRepository.findByNoteId(noteId);
    }

    public void removeCollaboration(Long collaborationId) {
        collaborationRepository.deleteById(collaborationId);
    }
}
