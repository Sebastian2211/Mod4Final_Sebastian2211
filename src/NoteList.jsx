import React from 'react';

function NoteList({ notes }) {
    return (
        <div>
            <h3>Your Notes</h3>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <h4>{note.title}</h4>
                        <p>{note.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NoteList;
