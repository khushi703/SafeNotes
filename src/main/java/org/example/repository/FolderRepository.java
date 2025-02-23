package org.example.repository;

import org.example.entities.Folder;
import org.example.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUser(User user);

    Optional<Folder> findByIdAndUser(Long folderId, User user);
}