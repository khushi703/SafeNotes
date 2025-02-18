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
            <div class="toolbar">
                <button class="icon-button" id="pinNoteButton">📌 </button>
                <button class="icon-button" id="privateNoteButton">🔒 </button>
                <button class="icon-button" id="addImageButton">🖼️ </button>
                <button class="icon-button" id="shareNoteButton">📤 </button>
                <button class="icon-button" id="reminderButton">⏰ </button>
                <button class="icon-button" id="deleteNoteButton">🗑️ </button>
                <button class="icon-button" id="copyNoteButton">📋 </button>
                <button class="icon-button" id="versionHistoryButton">📜 </button>
                <button class="icon-button" id="checkboxButton">☑️ </button>
            </div>
            <button id="closeModal">Save</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

const closeModalButton = document.getElementById('closeModal');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentTextarea = document.getElementById('noteContent');
const titleError = document.getElementById('titleError');

let editingNote = null; // Track the note being edited

// Get references to the toolbar buttons
const pinNoteButton = document.getElementById('pinNoteButton');
const privateNoteButton = document.getElementById('privateNoteButton');
const addImageButton = document.getElementById('addImageButton');
const shareNoteButton = document.getElementById('shareNoteButton');
const reminderButton = document.getElementById('reminderButton');
const deleteNoteButton = document.getElementById('deleteNoteButton');
const copyNoteButton = document.getElementById('copyNoteButton');
const versionHistoryButton = document.getElementById('versionHistoryButton');
const checkboxButton = document.getElementById('checkboxButton');

// Function to open the modal
addNoteButton.addEventListener('click', function() {
    modal.style.display = 'block';
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    titleError.style.display = 'none'; // Hide error message when modal opens
    editingNote = null; // Reset editing note
});

// Function to close the modal and clear input fields
closeModalButton.addEventListener('click', function() {
    if (noteTitleInput.value.trim() === "") {
        titleError.style.display = 'block'; // Show error if title is empty
        return; // Stop the function
    }

    modal.style.display = 'none';

    if (editingNote) {
        // If editing, update existing note
        editingNote.querySelector('h3').innerText = noteTitleInput.value;
        editingNote.querySelector('p').innerText = noteContentTextarea.value;


    } else {
        // Otherwise, create a new note
        addNote(noteTitleInput.value, noteContentTextarea.value);
    }

    noteTitleInput.value = ''; // Clear title
    noteContentTextarea.value = ''; // Clear content
    titleError.style.display = 'none'; // Hide error after successful save
    editingNote = null; // Reset editing note

    saveNotesToLocalStorage();
});

// Add note function
function addNote(title, content) {
    if (!title) return; // Prevent empty notes

    let notesContainer = document.getElementById('notesContainer');

    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>

    `;
    noteDiv.addEventListener('click', function() {
        editNote(this); // Call editNote when the note is clicked
    });

    notesContainer.appendChild(noteDiv);

    saveNotesToLocalStorage();
}

function editNote(noteDiv) { // Modified to take the noteDiv directly
    editingNote = noteDiv; // Set the note being edited

    // Populate the modal with the note's data
    noteTitleInput.value = noteDiv.querySelector('h3').innerText;
    noteContentTextarea.value = noteDiv.querySelector('p').innerText;


    modal.style.display = 'block';
    titleError.style.display = 'none'; // Hide error message
}

function deleteNote(button) {
    button.parentElement.remove();

    saveNotesToLocalStorage();
}

function copyNote(button) {
    let noteText = button.parentElement.querySelector('h3').innerText;
    navigator.clipboard.writeText(noteText);
    alert("Note copied!");
}

//Functionality for the Check box button
function handleCheckboxButtonClick(button) {
    alert("Checkbox button clicked");
    // Here, implement your logic for the checkbox button
}
//New Functions
function pinTheNote(button){
    if (editingNote) {
        editingNote.classList.add('pinned');

        saveNotesToLocalStorage();
        alert("Note Pinned!");
    }
}

function makeNotePrivate(button){
    if (editingNote) {
        editingNote.classList.add('private');

        saveNotesToLocalStorage();
        alert("Note Marked as Private!");
    }
}

// Event listeners for the toolbar buttons
addImageButton.addEventListener('click', function() {
    alert("Add Image functionality"); // Replace with actual functionality
});

shareNoteButton.addEventListener('click', function() {
    alert("Share Note functionality"); // Replace with actual functionality
});

reminderButton.addEventListener('click', function() {
    alert("Reminder functionality"); // Replace with actual functionality
});

deleteNoteButton.addEventListener('click', function() {
    if (editingNote) {
        editingNote.remove();
        modal.style.display = 'none';  // close the modal after deletion
        saveNotesToLocalStorage();
        editingNote = null;  // reset editingNote
    } else {
        alert("No note selected to delete.");
    }
});

copyNoteButton.addEventListener('click', function() {
    if (editingNote) {
        let noteTitle = editingNote.querySelector('h3').innerText;
        let noteContent = editingNote.querySelector('p').innerText;
        navigator.clipboard.writeText(`${noteTitle}\n${noteContent}`)
            .then(() => alert("Note copied to clipboard!"))
            .catch(err => console.error("Could not copy note: ", err));
    } else {
        alert("No note selected to copy.");
    }
});

versionHistoryButton.addEventListener('click', function() {
    alert("versionHistory functionality"); // Replace with actual functionality
});

checkboxButton.addEventListener('click', handleCheckboxButtonClick);

pinNoteButton.addEventListener('click', pinTheNote);
privateNoteButton.addEventListener('click', makeNotePrivate);

function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');

    notes.forEach(note => {
        let notesContainer = document.getElementById('notesContainer');
        if (notesContainer){
            let noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            `;
            noteDiv.addEventListener('click', function() {
                editNote(this); // Call editNote when the note is clicked
            });
            notesContainer.appendChild(noteDiv);
        }
    });
}

function saveNotesToLocalStorage() {
    const notes = [];
    const noteElements = document.querySelectorAll('.note');

    noteElements.forEach(noteElement => {
        notes.push({
            title: noteElement.querySelector('h3').innerText, //Get the title from the note
            content: noteElement.querySelector('p').innerText,
        });
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

window.addEventListener('load', loadNotesFromLocalStorage);