import React, { useState } from 'react';
import axios from 'axios';

function NoteForm({ onNoteAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data', data);
                // You can handle the data as needed here
                // For example, you can add the new note to your state or perform any other actions
            } else {
                console.error('Note creation error:', response);
            }

            // Reset the form and trigger any necessary actions
            setFormData({
                title: '',
                content: '',
            });
            onNoteAdded(); // Make sure this function is defined and does what you intend
        } catch (error) {
            console.error('Note creation error:', error);
        }
    };

    return (
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
    );
}

export default NoteForm;
