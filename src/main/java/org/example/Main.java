package org.example;

import org.example.entities.*;
import org.example.utils.EncryptionUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        // Build the SessionFactory using Hibernate configuration file
        try (SessionFactory sessionFactory = new Configuration()
                .configure("hibernate.cfg.xml")
                .buildSessionFactory()) {

            // Open a new session
            try (Session session = sessionFactory.openSession()) {

                // Begin transaction
                Transaction transaction = session.beginTransaction();

                try {
                    // Create a new User
                    User user = new User();
                    user.setUsername("john_doe");
                    user.setEmail("john.doe@example.com");
                    user.setPassword("securePasswordHash"); // Ensure passwords are hashed

                    // Create a Folder
                    Folder folder = new Folder();
                    folder.setFname("Work Notes");
                    folder.setUser(user);

                    // Create a Note with encrypted content
                    Note note = new Note();
                    note.setTitle("Project Plan");

                    // Encrypt the content using EncryptionUtil
                    String encryptedContent = encryptContent("This is the project plan...");
                    if (encryptedContent == null) {
                        throw new RuntimeException("Failed to encrypt content.");
                    }
                    note.setEncryptedContent(encryptedContent);

                    note.setCreatedDate(LocalDateTime.now());
                    note.setOwner(user);
                    note.setFolder(folder);

                    // Associate note with folder
                    Set<Note> notes = new HashSet<>();
                    notes.add(note);
                    folder.setNotes(notes);

                    // Associate folder and note with user
                    Set<Folder> folders = new HashSet<>();
                    folders.add(folder);
                    user.setFolders(folders);
                    user.setNotes(notes);

                    // Save User (cascades to folders and notes)
                    session.persist(user);

                    // Commit the transaction
                    transaction.commit();

                    System.out.println("Entities successfully saved!");

                } catch (Exception e) {
                    // Rollback the transaction in case of an error
                    if (transaction != null) transaction.rollback();
                    System.err.println("Transaction rolled back due to an error:");
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            // Handle SessionFactory initialization errors
            System.err.println("SessionFactory initialization failed:");
            e.printStackTrace();
        }
    }

    // Encrypt content using EncryptionUtil
    private static String encryptContent(String content) {
        try {
            // Use EncryptionUtil to encrypt the content
            return EncryptionUtil.encrypt(content);
        } catch (Exception e) {
            System.err.println("Failed to encrypt content:");
            e.printStackTrace();
            return null; // Return null if encryption fails
        }
    }
}