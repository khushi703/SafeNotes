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

// Function to add a new checkbox input
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

// Event listener for "+ Add Checkbox" button
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
        addNote(noteTitleInput.value, noteContentTextarea.value, checkboxes, currentFolder);
    }

    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    checkboxContainer.innerHTML = '';
    titleError.style.display = 'none';

    saveNotesToLocalStorage();
});

// Function to format note content (text + checkboxes)
function formatNoteContent(text, checkboxes) {
    let formatted = `<p>${text}</p>`;
    checkboxes.forEach(cb => {
        formatted += `<div><input type="checkbox" ${cb.isChecked ? 'checked' : ''} disabled> ${cb.text}</div>`;
    });
    return formatted;
}

// Add new note
function addNote(title, content, checkboxes, folder) {
    if (!title.trim()) return;

    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.dataset.folder = folder;
    noteDiv.dataset.checkboxes = JSON.stringify(checkboxes);

    noteDiv.innerHTML = `
        <h3>${title}</h3>
        <div class="note-content">${formatNoteContent(content, checkboxes)}</div>
        <button class="duplicate-note">Duplicate</button>
        <button class="delete-note">Delete</button>
    `;

    // Duplicate note functionality
    noteDiv.querySelector('.duplicate-note').addEventListener('click', function (event) {
        event.stopPropagation();
        duplicateNote(title, content, checkboxes, folder);
    });

    // Delete note functionality
    noteDiv.querySelector('.delete-note').addEventListener('click', function (event) {
        event.stopPropagation();
        deleteNote(noteDiv);
    });

    noteDiv.addEventListener('click', function () {
        editNote(this);
    });

    notesContainer.appendChild(noteDiv);
    saveNotesToLocalStorage();
    filterNotesByFolder();
}

// Duplicate note function
function duplicateNote(title, content, checkboxes, folder) {
    addNote(title, content, checkboxes, folder);
}

// Edit an existing note
function editNote(noteDiv) {
    editingNote = noteDiv;
    noteTitleInput.value = noteDiv.querySelector('h3').innerText;
    noteContentTextarea.value = noteDiv.querySelector('.note-content p').innerText;
    checkboxContainer.innerHTML = '';

    let savedCheckboxes = JSON.parse(noteDiv.dataset.checkboxes || '[]');
    savedCheckboxes.forEach(cb => {
        let checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('checkbox-item');
        checkboxDiv.innerHTML = `
            <input type="checkbox" ${cb.isChecked ? 'checked' : ''}>
            <input type="text" class="checkboxText" value="${cb.text}">
        `;
        checkboxContainer.appendChild(checkboxDiv);
    });

    modal.style.display = 'block';
    titleError.style.display = 'none';
}

// Delete a note
function deleteNote(noteDiv) {
    notesContainer.removeChild(noteDiv);
    saveNotesToLocalStorage();
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
            content: noteElement.querySelector('.note-content p').innerText,
            checkboxes: JSON.parse(noteElement.dataset.checkboxes || '[]'),
            folder: noteElement.dataset.folder
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load notes from local storage
function loadNotesFromLocalStorage() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => {
        addNote(note.title, note.content, note.checkboxes, note.folder);
    });
    filterNotesByFolder();
}

// Initialize on page load
window.addEventListener('load', () => {
    loadNotesFromLocalStorage();
});
