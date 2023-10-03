import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';

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
        console.log('Token:', token);
        if (token) {
            // Fetch user data
            fetch('http://localhost:3000/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error('Authentication failed');
                        navigate('/login');
                    }
                })
                .then((data) => {
                    setUserData(data.user);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });

            // Fetch user's notes
            fetch('http://localhost:3000/notes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error('Error fetching notes');
                        throw new Error('Error fetching notes');
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
                    // console.error('req.user', req.user);
                    console.error('Error fetching notes:', error);
                    return [];
                });
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNoteAdded = () => {
        // Fetch updated notes after adding a new note
        fetch('http://localhost:3000/notes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching notes');
                    return [];
                }
            })
            .then((data) => {
                setNotes(data);
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
                return [];
            });

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

    return (
        <div>
            {userData && (
                <div>
                    <h2>Welcome, {userData.username}!</h2>
                    <div>
                        <h3>Create a New Note</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="content">Content:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <button type="submit">Create Note</button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h3>Your Notes</h3>
                        {notes.length > 0 ? (
                            <div>
                                <h3>Your Notes</h3>
                                {notes.length > 0 ? (
                                    <NoteList notes={notes} />
                                ) : (
                                    <p>No notes found.</p>
                                )}
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
            )}
        </div>
    );
}

export default Dashboard;
