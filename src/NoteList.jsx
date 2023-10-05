import React, { useState } from 'react';


function NoteList({ notes, onDeleteNote, onEditNote }) {
    const [editNote, setEditNote] = useState(null);

    const handleEditNote = (note) => {
        setEditNote(note);
        onEditNote(note);
    };

    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id}>
                    <h4 className='note-title'>{note.title}</h4>
                    <p className='note-content'>{note.content}</p>
                    <button onClick={() => onDeleteNote(note.id)}>Delete</button>
                    <button onClick={() => handleEditNote(note)}>Edit</button>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
