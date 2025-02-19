// Get references to the modal and related elements
const addNoteButton = document.getElementById('addNote');
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <input type="text" id="noteTitle" placeholder="Title" required>
            <p id="titleError" style="color: red; display: none;">Title is required</p>
        </div>
        <div class="modal-body">
            <textarea id="noteContent" placeholder="Take a note..."></textarea>
        </div>
        <div class="modal-footer">
            <button id="closeModal">Save</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

const closeModalButton = document.getElementById('closeModal');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentTextarea = document.getElementById('noteContent');
const titleError = document.getElementById('titleError');
const notesContainer = document.getElementById('notesContainer');
const folderList = document.getElementById('folderList');
const createFolderButton = document.getElementById('createFolder');
const notesButton = document.getElementById('Notes');

let editingNote = null;
let currentFolder = 'default';
let lastOpenedNote = null;

addNoteButton.addEventListener('click', function() {
    modal.style.display = 'block';

    // Clear previous values to ensure a fresh note
    noteTitleInput.value = '';
    noteContentTextarea.value = '';

    titleError.style.display = 'none';
    editingNote = null;
});

// Function to close the modal and save notes
closeModalButton.addEventListener('click', function() {
    if (!noteTitleInput.value.trim()) {
        titleError.style.display = 'block';
        return;
    }

    modal.style.display = 'none';

    if (editingNote) {
        editingNote.querySelector('h3').innerText = noteTitleInput.value;
        editingNote.querySelector('p').innerText = noteContentTextarea.value;
        editingNote.dataset.folder = currentFolder;
        editingNote = null;
    } else {
        addNote(noteTitleInput.value, noteContentTextarea.value, currentFolder);
    }

    lastOpenedNote = { title: noteTitleInput.value, content: noteContentTextarea.value };
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    titleError.style.display = 'none';
    editingNote = null;

    saveNotesToLocalStorage();
});

function addNote(title, content, folder) {
    if (!title.trim()) return;

    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.dataset.folder = folder;
    noteDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <button class="delete-note">Delete</button>
    `;

    // Add event listener to delete the note
    noteDiv.querySelector('.delete-note').addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the edit function
        deleteNote(noteDiv);
    });

    noteDiv.addEventListener('click', function() {
        editNote(this);
    });

    notesContainer.appendChild(noteDiv);
    saveNotesToLocalStorage();
    filterNotesByFolder();
}
function deleteNote(noteDiv) {
    notesContainer.removeChild(noteDiv);
    saveNotesToLocalStorage(); // Update storage after deletion
}


// Edit an existing note
function editNote(noteDiv) {
    editingNote = noteDiv;
    noteTitleInput.value = noteDiv.querySelector('h3').innerText;
    noteContentTextarea.value = noteDiv.querySelector('p').innerText;
    modal.style.display = 'block';
    titleError.style.display = 'none';
    lastOpenedNote = { title: noteDiv.querySelector('h3').innerText, content: noteDiv.querySelector('p').innerText };
}

// Filter notes based on the selected folder
function filterNotesByFolder() {
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        if (note.dataset.folder === currentFolder) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

// Save notes to local storage
function saveNotesToLocalStorage() {
    const notes = [];
    document.querySelectorAll('.note').forEach(noteElement => {
        notes.push({
            title: noteElement.querySelector('h3').innerText,
            content: noteElement.querySelector('p').innerText,
            folder: noteElement.dataset.folder
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load notes from local storage
function loadNotesFromLocalStorage() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => {
        addNote(note.title, note.content, note.folder);
    });
    filterNotesByFolder();
}

// Create a new folder
createFolderButton.addEventListener('click', () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        const folderItem = document.createElement('li');
        const newFolderButton = document.createElement('button');
        newFolderButton.textContent = folderName;
        newFolderButton.dataset.folder = folderName;
        newFolderButton.addEventListener('click', () => {
            currentFolder = folderName;
            filterNotesByFolder();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-folder");
        deleteButton.addEventListener('click', () => {
            folderList.removeChild(folderItem);
            localStorage.removeItem(`notes-${folderName}`);
            if (currentFolder === folderName) {
                currentFolder = 'default';
                filterNotesByFolder();
            }
            saveFoldersToLocalStorage();
        });

        folderItem.appendChild(newFolderButton);
        folderItem.appendChild(deleteButton);
        folderList.appendChild(folderItem);
        saveFoldersToLocalStorage();
    }
});

// Show all notes in default section
notesButton.addEventListener('click', () => {
    currentFolder = 'default';
    filterNotesByFolder();
});

// Initialize on page load
window.addEventListener('load', () => {
    loadFoldersFromLocalStorage();
    loadNotesFromLocalStorage();
});
