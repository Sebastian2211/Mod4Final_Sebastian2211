import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

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
    console.log('notes', notes);
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <div>
                    <h3>Create a New Note</h3>
                    <NoteForm onNoteAdded={handleNoteAdded} />
                </div>
                <div>
                    <h3>Your Notes</h3>
                    {notes.length > 0 ? (
                        <div>
                            <NoteList notes={notes} />
                            <ul>
                                {notes.map((note) => (
                                    <li key={note.id}>
                                        <h4 className='note-title'>{note.title}</h4>
                                        <p className='note-content'>{note.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No notes found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
