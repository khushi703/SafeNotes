package org.example.service;
import org.example.entities.Folder;
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

    public List<Folder> getAllFolders() {
        return folderRepository.findAll();
    }

    public void deleteFolder(Long folderId) {
        folderRepository.deleteById(folderId);
    }
}
