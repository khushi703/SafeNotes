document.addEventListener("DOMContentLoaded", async function () {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    const notesContainer = document.getElementById("notesContainer");
    const folderList = document.getElementById("folderList");
    const addNoteButton = document.getElementById("addNote");
    const folderButton = document.getElementById("Folder");
    const createFolderButton = document.getElementById("createFolder");
    const notesButton = document.getElementById("Notes"); // Button to fetch all notes
    let selectedFolderId = null; // Track the selected folder

    async function fetchFolders() {
        selectedFolderId = null; // Clear folder selection when fetching all notes
        try {
            const response = await fetch("http://localhost:8080/api/folders/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const folders = await response.json();
                displayFolders(folders);
            } else {
                console.error("Failed to fetch folders:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    }

    function displayFolders(folders) {
        folderList.innerHTML = "";
        folders.forEach(folder => {
            const folderElement = document.createElement("li");
            folderElement.textContent = folder.fname;

            // Add a delete button for each folder
            const deleteFolderButton = document.createElement("button");
            deleteFolderButton.textContent = "Delete";
            deleteFolderButton.addEventListener("click", async (event) => {
                event.stopPropagation(); // Prevent folder click event from firing
                if (confirm(`Are you sure you want to delete the folder "${folder.fname}"?`)) {
                    await deleteFolder(folder.id);
                }
            });

            folderElement.appendChild(deleteFolderButton);

            folderElement.addEventListener("click", async () => {
                selectedFolderId = folder.id;
                await fetchNotesByFolder(folder.id); // Fetch notes for the selected folder
            });

            folderList.appendChild(folderElement);
        });
    }

    async function deleteFolder(folderId) {
        try {
            const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                alert("Folder deleted successfully!");
                await fetchFolders(); // Refresh the folder list
            } else {
                console.error("Failed to delete folder:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    }

    async function fetchNotes() {
        try {
            const response = await fetch("http://localhost:8080/api/notes", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
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

    async function fetchNotesByFolder(folderId) {
        try {
            const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Ensure notes is always an array
                const notes = Array.isArray(data.notes) ? data.notes : [];
                displayNotes(notes);
            } else if (response.status === 404) {
                // If folder does not exist, clear the notes container
                notesContainer.innerHTML = "<p>Folder not found or empty.</p>";
            } else {
                console.error("Failed to fetch folder notes:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching folder notes:", error);
        }
    }

    function displayNotes(notes) {
        notesContainer.innerHTML = "";
        if (!Array.isArray(notes) || notes.length === 0) {
            notesContainer.innerHTML = "<p>No notes found.</p>";
            return;
        }

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
            if (selectedFolderId) {
                createNoteInFolder(title, content, selectedFolderId);
            } else {
                createNote(title, content);
            }
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

    async function createNoteInFolder(title, content, folderId) {
        try {
            const response = await fetch("http://localhost:8080/api/notes/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    encryptedContent: content,
                    password: "null", // You can modify this if needed
                    folder: {
                        id: folderId // Include the folder ID in the payload
                    }
                })
            });

            if (response.ok) {
                await fetchNotesByFolder(folderId); // Refresh notes for the selected folder
            } else {
                console.error("Failed to create note in folder");
            }
        } catch (error) {
            console.error("Error creating note in folder:", error);
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
                    if (selectedFolderId) {
                        await fetchNotesByFolder(selectedFolderId);
                    } else {
                        await fetchNotes();
                    }
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
                    if (selectedFolderId) {
                        await fetchNotesByFolder(selectedFolderId);
                    } else {
                        await fetchNotes();
                    }
                } else {
                    console.error("Failed to delete note");
                }
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    }

    createFolderButton.addEventListener("click", async function () {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            try {
                const response = await fetch("http://localhost:8080/api/folders/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ fname: folderName })
                });
                if (response.ok) {
                    await fetchFolders();
                } else {
                    console.error("Failed to create folder");
                }
            } catch (error) {
                console.error("Error creating folder:", error);
            }
        }
    });

    folderButton.addEventListener("click", fetchFolders);

    // Add event listener to the "Notes" button to fetch all notes
    notesButton.addEventListener("click", function () {
        selectedFolderId = null; // Clear folder selection
        fetchNotes();
    });

    // Initial fetch of notes when the page loads
    fetchNotes();
});