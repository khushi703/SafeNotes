package org.example.controller;

import org.example.entities.Collaboration;
import org.example.service.CollaborationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborations")
public class CollaborationController {
    @Autowired
    private CollaborationService collaborationService;

    @PostMapping("/share")
    public ResponseEntity<Collaboration> shareNoteOrFolder(@RequestBody Collaboration collaboration) {
        return ResponseEntity.ok(collaborationService.addCollaboration(collaboration));
    }

    @GetMapping("/note/{noteId}")
    public ResponseEntity<List<Collaboration>> getNoteCollaborations(@PathVariable Long noteId) {
        return ResponseEntity.ok(collaborationService.getCollaboratorsByNote(noteId));
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<Collaboration>> getFolderCollaborations(@PathVariable Long folderId) {
        return ResponseEntity.ok(collaborationService.getCollaboratorsByFolder(folderId));
    }

    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<String> removeCollaboration(@PathVariable Long collaborationId) {
        collaborationService.removeCollaboration(collaborationId);
        return ResponseEntity.ok("Collaboration removed successfully");
    }

    @PostMapping("/accept/{collaborationId}")
    public ResponseEntity<Collaboration> acceptCollaboration(@PathVariable Long collaborationId) {
        return ResponseEntity.ok(collaborationService.acceptCollaboration(collaborationId));
    }

    @PostMapping("/reject/{collaborationId}")
    public ResponseEntity<Collaboration> rejectCollaboration(@PathVariable Long collaborationId) {
        return ResponseEntity.ok(collaborationService.rejectCollaboration(collaborationId));
    }

    @GetMapping("/note-permission/{userId}/{noteId}/{role}")
    public ResponseEntity<Boolean> hasNotePermission(
            @PathVariable Long userId,
            @PathVariable Long noteId,
            @PathVariable Collaboration.CollaborationRole role
    ) {
        return ResponseEntity.ok(collaborationService.hasNotePermission(userId, noteId, role));
    }
    @GetMapping("/folder-permission/{userId}/{folderId}/{role}")
    public ResponseEntity<Boolean> hasFolderPermission(@PathVariable Long userId, @PathVariable Long folderId, @PathVariable Collaboration.CollaborationRole role) {
        return ResponseEntity.ok(collaborationService.hasNotePermission(userId, folderId, role));
    }
}