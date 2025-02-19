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
            <div id="checkboxContainer"></div>
        </div>
        <div class="modal-footer">
            <button id="addCheckbox">+ Add Checkbox</button>
            <button id="closeModal">Save</button>
        </div>
    </div>
`;

document.body.appendChild(modal);

const closeModalButton = document.getElementById('closeModal');
const addCheckboxButton = document.getElementById('addCheckbox');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentTextarea = document.getElementById('noteContent');
const checkboxContainer = document.getElementById('checkboxContainer');
const titleError = document.getElementById('titleError');
const notesContainer = document.getElementById('notesContainer');
const folderList = document.getElementById('folderList');
const createFolderButton = document.getElementById('createFolder');
const notesButton = document.getElementById('Notes');
const searchInput = document.getElementById('searchInput'); // Get the search input element


let editingNote = null;
let currentFolder = 'default';

// Open modal for new note
addNoteButton.addEventListener('click', function () {
    modal.style.display = 'block';
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    checkboxContainer.innerHTML = '';
    titleError.style.display = 'none';
    editingNote = null;
});

// Add checkbox functionality
function addCheckbox() {
    let checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox-item');

    checkboxDiv.innerHTML = `
        <input type="checkbox">
        <input type="text" class="checkboxText" placeholder="Enter task">
    `;

    let checkboxInput = checkboxDiv.querySelector('.checkboxText');
    checkboxInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addCheckbox();
        }
    });

    checkboxContainer.appendChild(checkboxDiv);
    checkboxInput.focus();
}

addCheckboxButton.addEventListener('click', function () {
    addCheckbox();
});

// Close modal and save note
closeModalButton.addEventListener('click', function () {
    if (!noteTitleInput.value.trim()) {
        titleError.style.display = 'block';
        return;
    }

    modal.style.display = 'none';

    let checkboxes = Array.from(checkboxContainer.children).map(cb => ({
        isChecked: cb.querySelector('input[type="checkbox"]').checked,
        text: cb.querySelector('.checkboxText').value
    }));

    if (editingNote) {
        editingNote.querySelector('h3').innerText = noteTitleInput.value;
        editingNote.querySelector('.note-content').innerHTML = formatNoteContent(noteContentTextarea.value, checkboxes);
        editingNote.dataset.folder = currentFolder;
        editingNote.dataset.checkboxes = JSON.stringify(checkboxes);
        editingNote = null;
    } else {
        addNote(noteTitleInput.value, noteContentTextarea.value, checkboxes, currentFolder, false);
    }

    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    checkboxContainer.innerHTML = '';
    titleError.style.display = 'none';

    saveNotesToLocalStorage();
});

// Format note content (text + checkboxes)
function formatNoteContent(text, checkboxes) {
    let formatted = `<p>${text}</p>`;
    checkboxes.forEach(cb => {
        formatted += `<div><input type="checkbox" ${cb.isChecked ? 'checked' : ''} disabled> ${cb.text}</div>`;
    });
    return formatted;
}

// Add new note
function addNote(title, content, checkboxes, folder, isPinned) {
    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.dataset.folder = folder;
    noteDiv.dataset.checkboxes = JSON.stringify(checkboxes);
    noteDiv.dataset.pinned = isPinned;

    noteDiv.innerHTML = `
        <h3>${title}</h3>
        <div class="note-content">${formatNoteContent(content, checkboxes)}</div>
        <button class="pin-note">${isPinned ? 'Unpin' : 'Pin'}</button>
        <button class="duplicate-note">Duplicate</button>
        <button class="delete-note">Delete</button>
    `;

    noteDiv.querySelector('.pin-note').addEventListener('click', function (event) {
        event.stopPropagation();
        togglePin(noteDiv);
    });

    noteDiv.querySelector('.duplicate-note').addEventListener('click', function (event) {
        event.stopPropagation();
        duplicateNote(title, content, checkboxes, folder);
    });

    noteDiv.querySelector('.delete-note').addEventListener('click', function (event) {
        event.stopPropagation();
        deleteNote(noteDiv);
    });

    noteDiv.addEventListener('click', function () {
        editNote(this);
    });

    notesContainer.appendChild(noteDiv);
    arrangeNotes();
    saveNotesToLocalStorage();
}

// Toggle Pin
function togglePin(noteDiv) {
    noteDiv.dataset.pinned = noteDiv.dataset.pinned === 'true' ? 'false' : 'true';
    noteDiv.querySelector('.pin-note').textContent = noteDiv.dataset.pinned === 'true' ? 'Unpin' : 'Pin';
    arrangeNotes();
    saveNotesToLocalStorage();
}

// Arrange pinned notes first
function arrangeNotes() {
    let notes = Array.from(document.querySelectorAll('.note'));
    notes.sort((a, b) => (b.dataset.pinned === 'true') - (a.dataset.pinned === 'true'));
    notes.forEach(note => notesContainer.appendChild(note));
}

// Duplicate note
function duplicateNote(title, content, checkboxes, folder) {
    addNote(title, content, checkboxes, folder, false);
}

// Delete note
function deleteNote(noteDiv) {
    notesContainer.removeChild(noteDiv);
    saveNotesToLocalStorage();
}

// Folder functionality
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
            if (currentFolder === folderName) {
                currentFolder = 'default';
                filterNotesByFolder();
            }
        });

        folderItem.appendChild(newFolderButton);
        folderItem.appendChild(deleteButton);
        folderList.appendChild(folderItem);
    }
});

// Show all notes in "default" folder
notesButton.addEventListener('click', () => {
    currentFolder = 'default';
    filterNotesByFolder();
});

// Load and filter notes
function filterNotesByFolder() {
    document.querySelectorAll('.note').forEach(note => {
        note.style.display = note.dataset.folder === currentFolder ? 'block' : 'none';
    });
}

// Load notes on page load
window.addEventListener('load', () => {
    loadNotesFromLocalStorage();
});

// Local Storage functions
function saveNotesToLocalStorage() {
    const notes = Array.from(notesContainer.querySelectorAll('.note')).map(noteDiv => {
        return {
            title: noteDiv.querySelector('h3').innerText,
            content: noteDiv.querySelector('.note-content').innerHTML,
            checkboxes: JSON.parse(noteDiv.dataset.checkboxes),
            folder: noteDiv.dataset.folder,
            isPinned: noteDiv.dataset.pinned === 'true'
        };
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.forEach(note => {
        const tempDiv = document.createElement('div'); // Create a temporary div
        tempDiv.innerHTML = note.content;

        // Extract text content from the div (excluding checkbox elements)
        let noteContentText = '';
        tempDiv.querySelectorAll('p').forEach(p => {
            noteContentText += p.textContent + ' ';
        });
        noteContentText = noteContentText.trim(); // Remove trailing spaces

        addNote(note.title, noteContentText, note.checkboxes, note.folder, note.isPinned);

    });
    arrangeNotes();
}

// Edit note
function editNote(noteDiv) {
    modal.style.display = 'block';
    editingNote = noteDiv;
    noteTitleInput.value = noteDiv.querySelector('h3').innerText;

    // Extract text content from the note content (excluding checkbox elements)
    const noteContentElement = noteDiv.querySelector('.note-content');
    let noteContentText = '';

    noteContentElement.querySelectorAll('p').forEach(p => {
        noteContentText += p.textContent + ' ';
    });

    noteContentTextarea.value = noteContentText.trim(); // Remove trailing spaces
    checkboxContainer.innerHTML = '';

    let checkboxes = JSON.parse(noteDiv.dataset.checkboxes);
    checkboxes.forEach(cb => {
        let checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('checkbox-item');
        checkboxDiv.innerHTML = `
            <input type="checkbox" ${cb.isChecked ? 'checked' : ''}>
            <input type="text" class="checkboxText" placeholder="Enter task" value="${cb.text}">
        `;

        let checkboxInput = checkboxDiv.querySelector('.checkboxText');
        checkboxInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addCheckbox();
            }
        });

        checkboxContainer.appendChild(checkboxDiv);
    });
}

// Search functionality
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = Array.from(notesContainer.querySelectorAll('.note'));
    const matchingNotes = [];

    notes.forEach(note => {
        const title = note.querySelector('h3').innerText.toLowerCase();
        const content = note.querySelector('.note-content').innerText.toLowerCase();

        const isMatch = title.includes(searchTerm) || content.includes(searchTerm);

        if (isMatch) {
            matchingNotes.push(note);
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });

    // Sort notes: Matching notes first, then pinned notes, then others
    notes.sort((a, b) => {
        const aMatches = matchingNotes.includes(a);
        const bMatches = matchingNotes.includes(b);
        const aPinned = a.dataset.pinned === 'true';
        const bPinned = b.dataset.pinned === 'true';

        if (aMatches && !bMatches) return -1;  // a comes before b
        if (!aMatches && bMatches) return 1;   // b comes before a
        if (aPinned && !bPinned) return -1;    // Pinned a comes before non-pinned b
        if (!aPinned && bPinned) return 1;     // Pinned b comes before non-pinned a
        return 0;  // Maintain original order
    });

    // Re-append notes to the container to reflect the new order
    notes.forEach(note => notesContainer.appendChild(note));

    // Ensure pinned notes are on top within matching notes
    arrangeNotes();

    // If search term is empty, reset filter
    if (searchTerm === '') {
        filterNotesByFolder();
        arrangeNotes();
    }
});