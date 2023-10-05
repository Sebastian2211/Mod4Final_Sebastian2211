import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import EditForm from './EditForm';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const [editedNote, setEditedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserNotes(token);
        console.log('Token:', token);
        // if (token) {
        //     // Fetch user data
        //     fetch('http://localhost:3000/users', {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //         },
        //     })
        //         .then((response) => {
        //             if (response.ok) {
        //                 return response.json();
        //             } else {
        //                 console.error('Authentication failed');
        //                 navigate('/login');
        //             }
        //         })
        //         .then((data) => {
        //             setUserData(data.user);
        //             fetchUserNotes(token);
        //         })
        //         .catch((error) => {
        //             console.error('Error fetching user data:', error);
        //         });
        // }
    }, [navigate]);

    // Fetch user's notes
    const fetchUserNotes = (token) => {
        fetch('http://localhost:3000/notes/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                // console.log('notes are here', notes);
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching notes');
                    return [];
                }
            })
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setNotes(data.data);
                } else {
                    console.error('Invalid JSON response:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
                return [];
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNoteAdded = () => {
        fetchUserNotes(localStorage.getItem('token'));
        setFormData({
            title: '',
            content: '',
        });
    };

    const handleDeleteNote = (noteId) => {
        console.log('Deleting note with ID:', noteId);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Note with ID ${noteId} deleted successfully`);
                    // Fetch updated notes after deletion
                    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
                } else {
                    console.error(`Error deleting note with ID ${noteId}`);
                }
            })
            .catch((error) => {
                console.error(`Error deleting note with ID ${noteId}:`, error);
            });
    };

    const startEditingNote = (note) => {
        setEditedNote(note);
        setIsEditing(true);
    };

    const cancelEditingNote = () => {
        setEditedNote(null);
        setIsEditing(false);
    };

    const updateNote = (updateNote) => {
        console.log('Updating note with ID:', updateNote.id);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/notes/${updateNote.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateNote),
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Note with ID ${updateNote.id} updated successfully`);
                    // Fetch updated notes after update
                    fetchUserNotes(token);
                    cancelEditingNote();
                } else {
                    console.error(`Error updating note with ID ${updateNote.id}`);
                }
            })
            .catch((error) => {
                console.error(`Error updating note with ID ${updateNote.id}:`, error);
            });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Note created successfully');
                handleNoteAdded();
            } else {
                console.error('Note creation failed');
            }
        } catch (error) {
            console.error('Note creation error:', error);
        }
    };
    // console.log('notes', notes);
    return (
        <div className='notes-body'>
            <h2 className='main-header'>Welcome!</h2>
            <div className='notes-input'>
                <h3 className='create'>Create a New Note</h3>
                <NoteForm onNoteAdded={handleNoteAdded} />
            </div>
            <div>
                <h3 className='create'>Your Notes</h3>
                {notes.length > 0 ? (
                    <div className='notes-inside'>
                        <NoteList
                            notes={notes}
                            onDeleteNote={handleDeleteNote}
                            onEditNote={startEditingNote} // Pass the startEditingNote function to NoteList
                        />
                        <ul>
                            {/* {notes.map((note) => (
                                <li key={note.id}>
                                    <h4 className='note-title'>{note.title}</h4>
                                    <p className='note-content'>{note.content}</p>
                                </li>
                            ))} */}
                        </ul>
                    </div>
                ) : (
                    <p>No notes found.</p>
                )}
            </div>
            {isEditing && (
                // Render the EditForm component when editing is in progress
                <EditForm
                    note={editedNote}
                    onUpdateNote={updateNote}
                    onCancelEdit={cancelEditingNote}
                />
            )}
        </div>
    );


}

export default Dashboard;
