package org.example.entities;

import jakarta.persistence.*;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class Collaboration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Collaboration_id;
    @ManyToOne
    @JoinColumn(name = "User_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "Note_id")
    private Note note;
    private LocalDateTime invitedAt;
    private boolean accepted;

    // Constructors, getters, and setters

    public Long getId() {
        return Collaboration_id;
    }

    public void setId(Long Collaboration_id) {
        this.Collaboration_id = Collaboration_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public LocalDateTime getInvitedAt() {
        return invitedAt;
    }

    public void setInvitedAt(LocalDateTime invitedAt) {
        this.invitedAt = invitedAt;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
