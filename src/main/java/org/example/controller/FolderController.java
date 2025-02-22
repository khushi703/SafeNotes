package org.example.controller;
import org.example.entities.Folder;
import org.example.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @PostMapping("/create")
    public ResponseEntity<Folder> createFolder(@RequestBody Folder folder) {
        return ResponseEntity.ok(folderService.saveFolder(folder));
    }

    @GetMapping("/")
    public ResponseEntity<List<Folder>> getAllFolders() {
        return ResponseEntity.ok(folderService.getAllFolders());
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long folderId) {
        folderService.deleteFolder(folderId);
        return ResponseEntity.ok("Folder deleted successfully");
    }
}
