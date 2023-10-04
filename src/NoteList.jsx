import React from 'react';

function NoteList({ notes }) {
    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id}>
                    <h4 className='note-title'>{note.title}</h4>
                    <p className='note-content'>{note.content}</p>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
