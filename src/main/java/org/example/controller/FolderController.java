package org.example.controller;

import org.example.entities.Folder;
import org.example.entities.User;
import org.example.service.CustomUserDetails;
import org.example.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @PostMapping("/create")
    public ResponseEntity<Folder> createFolder(@RequestBody Folder folder, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Get the authenticated user
        User user = userDetails.getUser();

        // Set the user (owner) for the folder
        folder.setUser(user);

        // Create the folder
        Folder createdFolder = folderService.saveFolder(folder);
        return ResponseEntity.ok(createdFolder);
    }

    @GetMapping("/")
    public ResponseEntity<List<Folder>> getAllFolders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // Get the authenticated user
        User user = userDetails.getUser();

        // Fetch folders for the authenticated user
        List<Folder> folders = folderService.getFoldersByUser(user);
        return ResponseEntity.ok(folders);
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<Folder> getFolderById(@PathVariable Long folderId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Get the authenticated user
        User user = userDetails.getUser();

        // Fetch the folder by ID and ensure it belongs to the authenticated user
        Folder folder = folderService.getFolderByIdAndUser(folderId, user);
        if (folder != null) {
            return ResponseEntity.ok(folder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long folderId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Get the authenticated user
        User user = userDetails.getUser();

        // Delete the folder (ensure the folder belongs to the authenticated user)
        folderService.deleteFolder(folderId, user);
        return ResponseEntity.ok("Folder deleted successfully");
    }
}