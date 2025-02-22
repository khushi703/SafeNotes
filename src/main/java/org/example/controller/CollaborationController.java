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
    public ResponseEntity<Collaboration> shareNote(@RequestBody Collaboration collaboration) {
        return ResponseEntity.ok(collaborationService.addCollaboration(collaboration));
    }

    @GetMapping("/note/{noteId}")
    public ResponseEntity<List<Collaboration>> getCollaborations(@PathVariable Long noteId) {
        return ResponseEntity.ok(collaborationService.getCollaborators(noteId));
    }

    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<String> removeCollaboration(@PathVariable Long collaborationId) {
        collaborationService.removeCollaboration(collaborationId);
        return ResponseEntity.ok("Collaboration removed successfully");
    }
}
