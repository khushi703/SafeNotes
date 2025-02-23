package org.example.service;

import org.example.entities.Folder;
import org.example.entities.User;
import org.example.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderService {

    @Autowired
    private FolderRepository folderRepository;

    public Folder saveFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    public List<Folder> getFoldersByUser(User user) {
        return folderRepository.findByUser(user);
    }

    public Folder getFolderByIdAndUser(Long folderId, User user) {
        return folderRepository.findByIdAndUser(folderId, user)
                .orElseThrow(() -> new RuntimeException("Folder not found or you are not authorized to access it"));
    }

    public void deleteFolder(Long folderId, User user) {
        // Ensure the folder belongs to the authenticated user before deleting
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (!folder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this folder");
        }

        folderRepository.delete(folder);
    }
}