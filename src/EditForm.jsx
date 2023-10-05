import React, { useState } from 'react';

function EditForm({ note, onUpdateNote, onCancelEdit }) {
    const [editedNote, setEditedNote] = useState(note);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedNote({
            ...editedNote,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateNote(editedNote);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={editedNote.title}
                onChange={handleChange}
            />
            <label>Content:</label>
            <textarea
                name="content"
                value={editedNote.content}
                onChange={handleChange}
            ></textarea>
            <button type="submit">Update Note</button>
            <button type="button" onClick={onCancelEdit}>
                Cancel
            </button>
        </form>
    );
}

export default EditForm;
