package org.example.service;
import org.example.entities.Note;
import org.example.entities.User;
import org.example.entities.Folder;
import org.example.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public List<Note> getNotesByOwner(User owner) {
        return noteRepository.findByOwner(owner);
    }

    public List<Note> getNotesByFolder(Folder folder) {
        return noteRepository.findByFolder(folder);
    }

    public Note createNote(Note note) {
        note.setCreatedDate(LocalDateTime.now());
        note.setUpdatedDate(LocalDateTime.now());
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note updatedNote) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(updatedNote.getTitle());
            note.setEncryptedContent(updatedNote.getEncryptedContent());
            note.setPassword(updatedNote.getPassword());
            note.setUpdatedDate(LocalDateTime.now());
            return noteRepository.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public void deleteNoteById(Long id) {
        noteRepository.deleteById(id);
    }
}
