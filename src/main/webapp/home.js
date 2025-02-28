document.addEventListener("DOMContentLoaded", async function () {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    const notesContainer = document.getElementById("notesContainer");
    const addNoteButton = document.getElementById("addNote");

    async function fetchNotes() {
        const authToken = localStorage.getItem("authToken"); // Get token from localStorage

        if (!authToken) {
            console.error("No auth token found! Redirecting to login...");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/notes", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,  // ✅ Send token in header
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const notes = await response.json();
                displayNotes(notes);
            } else {
                console.error("Failed to fetch notes:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    }


    function displayNotes(notes) {
        notesContainer.innerHTML = "";
        notes.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.encryptedContent || "[Encrypted Content]"}</p>
                <button onclick="editNote(${note.id}, '${note.title}', '${note.encryptedContent}')">Edit</button>
                <button onclick="deleteNote(${note.id})">Delete</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    }

    addNoteButton.addEventListener("click", function () {
        const title = prompt("Enter note title:");
        const content = prompt("Enter note content:");
        if (title && content) {
            createNote(title, content);
        }
    });

    async function createNote(title, content) {
        try {
            const response = await fetch("http://localhost:8080/api/notes/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ title, encryptedContent: content, password: "null" })
            });
            if (response.ok) {
                await fetchNotes();
            } else {
                console.error("Failed to create note");
            }
        } catch (error) {
            console.error("Error creating note:", error);
        }
    }

    window.editNote = async function (id, currentTitle, currentContent) {
        const newTitle = prompt("Edit title:", currentTitle);
        const newContent = prompt("Edit content:", currentContent);
        if (newTitle && newContent) {
            try {
                const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ title: newTitle, encryptedContent: newContent, password: "null" })
                });
                if (response.ok) {
                    await fetchNotes();
                } else {
                    console.error("Failed to update note");
                }
            } catch (error) {
                console.error("Error updating note:", error);
            }
        }
    }

    window.deleteNote = async function (id) {
        if (confirm("Are you sure you want to delete this note?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${authToken}` }
                });
                if (response.ok) {
                    await fetchNotes();
                } else {
                    console.error("Failed to delete note");
                }
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    }

    fetchNotes();
});
